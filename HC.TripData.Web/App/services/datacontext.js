define([
    'durandal/system',
    'durandal/app',
    'services/model',
    'config',
    'services/logger',
    'services/breeze.partial-entities',
    'services/cookie',
    'services/localdatastore'],
    function (system, app, model, config, logger, partialMapper, cookie, localdatastore) {
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
        
        var getDriverById = function (driverId, driverObservable) {
            // 1st - fetchEntityByKey will look in local cache 
            // first (because 3rd parm is true) 
            // if not there then it will go remote
            return manager.fetchEntityByKey(
                entityNames.driver, driverId, true)
                .then(fetchSucceeded)
                .fail(queryFailed);

            // 2nd - Refresh the entity from remote store (if needed)
            function fetchSucceeded(data) {
                var s = data.entity;
                return driverObservable(s);
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

        var getChanges = function() {
            return manager.getChanges();
        };
        
        var saveLocal = function () {
            var changes = manager.getChanges();
            if (changes) {
                var changesExport = manager.exportEntities(changes);
                localdatastore.storeChanges(changesExport);
            }
        };
        
        var syncWithServer = function () {
            //var currentDriver;
            //var driver = localdatastore.getDriver();
            //if (driver && driver.id > 0) {
            //    var currDriver = getDriverById(driver.id, currentDriver);
            //    currDriver.firstName = currDriver.firstName;  
            //}
            setStateFromLocalStorage();
            saveChanges();
        };
        
        var setStateFromLocalStorage = function() {
            var localChanges = localdatastore.getChanges();
            if (localChanges) {
                try {
                    manager.importEntities(localChanges);
                }catch(error) {
                    log(error.message, null, false);
                }
            }
        };

        var createTrip = function () {
            return manager.createEntity(entityNames.trip);
        };
        
     
        var fetchMetadata = function () {
            manager.metadataStore.importMetadata(JSON.stringify(getMetaData()));
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
            getDriverById: getDriverById,
            cancelChanges: cancelChanges,
            saveChanges: saveChanges,
            getChanges: getChanges,
            fetchMetadata: fetchMetadata,
            saveLocal: saveLocal,
            syncWithServer: syncWithServer,
            setStateFromLocalStorage: setStateFromLocalStorage
        };

        return datacontext;
        
        function fetchMetadataToUseInFile() {
            meta = manager.fetchMetadata();
            setTimeout(function () {
                var metadataAsString = manager.metadataStore.exportMetadata();
                window.localStorage.setItem("metadata", metadataAsString);
            }, 1000);
            return meta;
        };

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
            var driver = localdatastore.getDriver();
            var accessToken = '';// getCookieValue('tripdata-accesstoken');
            if (driver && driver.identifier) {
                accessToken = driver.identifier;
            }
            
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
       
        function getMetaData() {
            return  {"metadataVersion":"1.0.4","namingConvention":"camelCase","localQueryComparisonOptions":"caseInsensitiveSQL","dataServices":[{"serviceName":"http://tripdata.apphb.com/api/tripdata/","hasServerMetadata":true}],"structuralTypes":[{"shortName":"Car","namespace":"HC.TripData.Domain","autoGeneratedKeyType":"Identity","defaultResourceName":"Cars","dataProperties":[{"name":"carId","dataType":"Int64","isNullable":false,"defaultValue":0,"isPartOfKey":true,"validators":[{"name":"required"},{"name":"integer"}]},{"name":"licensePlateNumber","dataType":"String","isNullable":false,"defaultValue":"","maxLength":20,"validators":[{"name":"required"},{"maxLength":20,"name":"maxLength"}]},{"name":"make","dataType":"String","isNullable":false,"defaultValue":"","maxLength":100,"validators":[{"name":"required"},{"maxLength":100,"name":"maxLength"}]},{"name":"model","dataType":"String","isNullable":false,"defaultValue":"","maxLength":100,"validators":[{"name":"required"},{"maxLength":100,"name":"maxLength"}]},{"name":"isCurrentCar","dataType":"Boolean","isNullable":false,"defaultValue":false,"validators":[{"name":"required"},{"name":"bool"}]},{"name":"driverId","dataType":"Int64","isNullable":false,"defaultValue":0,"validators":[{"name":"required"},{"name":"integer"}]}],"navigationProperties":[{"name":"driver","entityTypeName":"Driver:#HC.TripData.Domain","isScalar":true,"associationName":"Driver_Cars","foreignKeyNames":["driverId"]}]},{"shortName":"Driver","namespace":"HC.TripData.Domain","autoGeneratedKeyType":"Identity","defaultResourceName":"Drivers","dataProperties":[{"name":"driverId","dataType":"Int64","isNullable":false,"defaultValue":0,"isPartOfKey":true,"validators":[{"name":"required"},{"name":"integer"}]},{"name":"lastName","dataType":"String","maxLength":100,"validators":[{"maxLength":100,"name":"maxLength"}]},{"name":"firstName","dataType":"String","maxLength":100,"validators":[{"maxLength":100,"name":"maxLength"}]},{"name":"emailAddress","dataType":"String","isNullable":false,"defaultValue":"","maxLength":100,"validators":[{"name":"required"},{"maxLength":100,"name":"maxLength"}]},{"name":"password","dataType":"String","isNullable":false,"defaultValue":"","maxLength":100,"validators":[{"name":"required"},{"maxLength":100,"name":"maxLength"}]},{"name":"salt","dataType":"String","maxLength":100,"validators":[{"maxLength":100,"name":"maxLength"}]}],"navigationProperties":[{"name":"token","entityTypeName":"AccessToken:#HC.TripData.Domain","isScalar":true,"associationName":"Driver_Token"},{"name":"cars","entityTypeName":"Car:#HC.TripData.Domain","isScalar":false,"associationName":"Driver_Cars"}]},{"shortName":"AccessToken","namespace":"HC.TripData.Domain","autoGeneratedKeyType":"Identity","defaultResourceName":"AccessTokens","dataProperties":[{"name":"accessTokenId","dataType":"Int64","isNullable":false,"defaultValue":0,"isPartOfKey":true,"validators":[{"name":"required"},{"name":"integer"}]},{"name":"issuedOn","dataType":"DateTime","isNullable":false,"defaultValue":"1899-12-31T23:00:00.000Z","validators":[{"name":"required"},{"name":"date"}]},{"name":"expiresOn","dataType":"DateTime","isNullable":false,"defaultValue":"1899-12-31T23:00:00.000Z","validators":[{"name":"required"},{"name":"date"}]},{"name":"token","dataType":"String","maxLength":100,"validators":[{"maxLength":100,"name":"maxLength"}]}]},{"shortName":"Trip","namespace":"HC.TripData.Domain","autoGeneratedKeyType":"Identity","defaultResourceName":"Trips","dataProperties":[{"name":"tripId","dataType":"Int64","isNullable":false,"defaultValue":0,"isPartOfKey":true,"validators":[{"name":"required"},{"name":"integer"}]},{"name":"startMilage","dataType":"Int32","isNullable":false,"defaultValue":0,"validators":[{"name":"required"},{"name":"int32"}]},{"name":"endMilage","dataType":"Int32","isNullable":false,"defaultValue":0,"validators":[{"name":"required"},{"name":"int32"}]},{"name":"dateTime","dataType":"DateTime","isNullable":false,"defaultValue":"1899-12-31T23:00:00.000Z","validators":[{"name":"required"},{"name":"date"}]},{"name":"placeOfDeparture","dataType":"String","maxLength":100,"validators":[{"maxLength":100,"name":"maxLength"}]},{"name":"destination","dataType":"String","maxLength":100,"validators":[{"maxLength":100,"name":"maxLength"}]},{"name":"description","dataType":"String","maxLength":250,"validators":[{"maxLength":250,"name":"maxLength"}]},{"name":"tripType","dataType":"String","isNullable":false,"defaultValue":"","validators":[{"name":"required"},{"name":"string"}],"enumType":"Edm.Self.TripType"},{"name":"driverId","dataType":"Int64","isNullable":false,"defaultValue":0,"validators":[{"name":"required"},{"name":"integer"}]},{"name":"carId","dataType":"Int64","validators":[{"name":"integer"}]}],"navigationProperties":[{"name":"driver","entityTypeName":"Driver:#HC.TripData.Domain","isScalar":true,"associationName":"Trip_Driver","foreignKeyNames":["driverId"]}]}],"resourceEntityTypeMap":{"Cars":"Car:#HC.TripData.Domain","Drivers":"Driver:#HC.TripData.Domain","AccessTokens":"AccessToken:#HC.TripData.Domain","Trips":"Trip:#HC.TripData.Domain"}};
        }
        

        
        //#endregion
    });