define([
    'durandal/system',
    'services/model',
    'config',
    'services/logger',
    'services/breeze.partial-entities'],
    function (system, model, config, logger, partialMapper) {
        var EntityQuery = breeze.EntityQuery;
        var manager = configureBreezeManager();
        var orderBy = model.orderBy;
        var entityNames = model.entityNames;

        var getDriverPartials = function (driversObservable, forceRemote) {

            if (!forceRemote) {
                var p = getLocal('Drivers', orderBy.driver);
                if (p.length > 0) {
                    driversObservable(p);
                    return Q.resolve();
                }
            }

            var query = EntityQuery.from('Drivers');
               // .orderBy(orderBy.driver);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.driver, 'driverid');
                if (driversObservable) {
                    driversObservable(list);
                }
                log('Retrieved [Driver] from remote data source',
                    data, true);
            }
        };

      
        var getTripById = function (tripId, tripObservable) {
            // 1st - fetchEntityByKey will look in local cache 
            // first (because 3rd parm is true) 
            // if not there then it will go remote
            return manager.fetchEntityByKey(
                entityNames.trip, tripId, true)
                .then(fetchSucceeded)
                .fail(queryFailed);

            // 2nd - Refresh the entity from remote store (if needed)
            function fetchSucceeded(data) {
                var s = data.entity;
                return s.isPartial() ? refreshTrip(s) : tripObservable(s);
            }

            function refreshTrip(session) {
                return EntityQuery.fromEntities(session)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }

            function querySucceeded(data) {
                var s = data.results[0];
                s.isPartial(false);
                log('Retrieved [Trip] from remote data source', s, true);
                return tripObservable(s);
            }

        };

        var cancelChanges = function () {
            manager.rejectChanges();
            log('Canceled changes', null, true);
        };

        var saveChanges = function () {
            return manager.saveChanges()
                .then(saveSucceeded)
                .fail(saveFailed);

            function saveSucceeded(saveResult) {
                log('Saved data successfully', saveResult, true);
            }

            function saveFailed(error) {
                var msg = 'Save failed: ' + getErrorMessages(error);
                logError(msg, error);
                error.message = msg;
                throw error;
            }
        };

        var primeData = function () {
            var promise = Q.all([
              //  getLookups(),
                getDriverPartials(null, true)]);
               // .then(applyValidators);

            return promise.then(success);

            function success() {
                //datacontext.lookups = {
                //    trips: getLocal('Trips', 'datetime', true),
                //    cars: getLocal('Cars', 'carId', true),
                //    driver: getLocal('Drivers', orderBy.driver, true)
                //};
                log('Primed data', datacontext.lookups);
            }

            function applyValidators() {
                model.applyTripsValidators(manager.metadataStore);
            }

        };

        var createTrip = function () {
            return manager.createEntity(entityNames.session);
        };

        var hasChanges = ko.observable(false);

        manager.hasChangesChanged.subscribe(function (eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });

        var datacontext = {
            createTrip: createTrip,
            getDriverPartials: getDriverPartials,
            hasChanges: hasChanges,
            getTripById: getTripById,
            primeData: primeData,
            cancelChanges: cancelChanges,
            saveChanges: saveChanges
        };

        return datacontext;

        //#region Internal methods        

        function getLocal(resource, ordering, includeNullos) {
            var query = EntityQuery.from(resource)
                .orderBy(ordering);
            if (!includeNullos) {
                query = query.where('id', '!=', 0);
            }
            return manager.executeQueryLocally(query);
        }

        function getErrorMessages(error) {
            var msg = error.message;
            if (msg.match(/validation error/i)) {
                return getValidationMessages(error);
            }
            return msg;
        }

        function getValidationMessages(error) {
            try {
                //foreach entity with a validation error
                return error.entitiesWithErrors.map(function (entity) {
                    // get each validation error
                    return entity.entityAspect.getValidationErrors().map(function (valError) {
                        // return the error message from the validation
                        return valError.errorMessage;
                    }).join('; <br/>');
                }).join('; <br/>');
            }
            catch (e) { }
            return 'validation error';
        }

        function queryFailed(error) {
            var msg = 'Error retreiving data. ' + error.message;
            logError(msg, error);
            throw error;
        }

        function configureBreezeManager() {
            breeze.NamingConvention.camelCase.setAsDefault();

            setAntiForgeryTokenInHeaderForAjax();
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }

        function setAntiForgeryTokenInHeaderForAjax() {
            var antiForgeryToken = $("#antiForgeryToken").val();
            if (antiForgeryToken) {
                // get the current default Breeze AJAX adapter & add header
                var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
                ajaxAdapter.defaultSettings = {
                    headers: {
                        'RequestVerificationToken': antiForgeryToken
                    },
                };
            }
        }

        function getLookups() {
            return EntityQuery.from('Lookups')
                .using(manager).execute()
                .then(processLookups)
                .fail(queryFailed);
        }

        function processLookups() {
            model.createNullos(manager);
        }


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(datacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(datacontext), true);
        }
        //#endregion
    });