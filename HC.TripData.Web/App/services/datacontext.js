define([
    'durandal/system',
    'durandal/app',
    'services/model',
    'config',
    'services/logger',
    'services/breeze.partial-entities',
    'services/cookie'],
    function (system, app, model, config, logger, partialMapper, cookie) {
        var EntityQuery = breeze.EntityQuery;
        var manager = configureBreezeManager();
        var entityNames = model.entityNames;

      
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


        var createTrip = function () {
            return manager.createEntity(entityNames.trip);
        };
        
        var primeData = function () {
            var promise = Q.all([getLookups()]).then(applyValidators);

            return promise.then(success);

            function success() {
                datacontext.lookups = {
                    cars: getLocal('Cars', 'model', true)
                };
                log('Primed data', datacontext.lookups);
            }

            function applyValidators() {
                model.applySessionValidators(manager.metadataStore);
            }

        };


        var hasChanges = ko.observable(false);

        manager.hasChangesChanged.subscribe(function (eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });
        
        app.on('accesstoken:new').then(function () {
            setAccessTokensInHeaderForAjax();
        });

        var datacontext = {
            createTrip: createTrip,
            hasChanges: hasChanges,
            getTripById: getTripById,
            cancelChanges: cancelChanges,
            saveChanges: saveChanges,
            primeData: primeData
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
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            model.configureMetadataStore(mgr.metadataStore);
            setAccessTokensInHeaderForAjax();
            
            return mgr;
        }

        function setAccessTokensInHeaderForAjax() {
            var requestVerificationToken = getCookieValue('__RequestVerificationToken');
            var accessToken = getCookieValue('tripdata-accesstoken');
            
            var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
            ajaxAdapter.defaultSettings = {
                headers: {
                    'X-TripData-AccessToken': accessToken,
                    'X-TripData-RequestVerificationToken': requestVerificationToken,
                },
            };
        }
        
        function getCookieValue(name) {
            var requestVerificationToken = cookie.getCookie(name);
            if (requestVerificationToken == undefined) {
                requestVerificationToken = '';
            }

            return requestVerificationToken;
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