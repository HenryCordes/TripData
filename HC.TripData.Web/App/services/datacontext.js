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
                manager.importEntities(localChanges);
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
            return {
                "namingConvention": "camelCase",
                "localQueryComparisonOptions": "caseInsensitiveSQL",
                "dataServices": [
                    {
                        "serviceName": "http://tripdata.apphb.com/api/tripdata/",
                        "adapterName": null,
                        "hasServerMetadata": true
                    }
                ],
                "_resourceEntityTypeMap": {
                    "Cars": "Car:#HC.TripData.Domain",
                    "Drivers": "Driver:#HC.TripData.Domain",
                    "AccessTokens": "AccessToken:#HC.TripData.Domain",
                    "Trips": "Trip:#HC.TripData.Domain"
                },
                "_entityTypeResourceMap": {
                    "Car:#HC.TripData.Domain": "Cars",
                    "Driver:#HC.TripData.Domain": "Drivers",
                    "AccessToken:#HC.TripData.Domain": "AccessTokens",
                    "Trip:#HC.TripData.Domain": "Trips"
                },
                "_structuralTypeMap": {
                    "Car:#HC.TripData.Domain": {
                        "name": "Car:#HC.TripData.Domain",
                        "shortName": "Car",
                        "namespace": "HC.TripData.Domain",
                        "defaultResourceName": "Cars",
                        "dataProperties": [
                            {
                                "name": "carId",
                                "nameOnServer": "CarId",
                                "dataType": "Int64",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": 0,
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "integer"
                                    }
                                ],
                                "isPartOfKey": true
                            },
                            {
                                "name": "licensePlateNumber",
                                "nameOnServer": "LicensePlateNumber",
                                "dataType": "String",
                                "isNullable": false,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": "",
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "make",
                                "nameOnServer": "Make",
                                "dataType": "String",
                                "isNullable": false,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": "",
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "model",
                                "nameOnServer": "Model",
                                "dataType": "String",
                                "isNullable": false,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": "",
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "isCurrentCar",
                                "nameOnServer": "IsCurrentCar",
                                "dataType": "Boolean",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": false,
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "bool"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "driverId",
                                "nameOnServer": "DriverId",
                                "dataType": "Int64",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": 0,
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "integer"
                                    }
                                ],
                                "isPartOfKey": false
                            }
                        ],
                        "navigationProperties": [
                            {
                                "name": "driver",
                                "nameOnServer": "Driver",
                                "entityTypeName": "Driver:#HC.TripData.Domain",
                                "isScalar": true,
                                "associationName": "Driver_Cars",
                                "foreignKeyNames": [
                                    "driverId"
                                ],
                                "foreignKeyNamesOnServer": [
                                    "DriverId"
                                ],
                                "validators": []
                            }
                        ],
                        "autoGeneratedKeyType": "Identity",
                        "validators": []
                    },
                    "Driver:#HC.TripData.Domain": {
                        "name": "Driver:#HC.TripData.Domain",
                        "shortName": "Driver",
                        "namespace": "HC.TripData.Domain",
                        "defaultResourceName": "Drivers",
                        "dataProperties": [
                            {
                                "name": "driverId",
                                "nameOnServer": "DriverId",
                                "dataType": "Int64",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": 0,
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "integer"
                                    }
                                ],
                                "isPartOfKey": true
                            },
                            {
                                "name": "lastName",
                                "nameOnServer": "LastName",
                                "dataType": "String",
                                "isNullable": true,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "firstName",
                                "nameOnServer": "FirstName",
                                "dataType": "String",
                                "isNullable": true,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "emailAddress",
                                "nameOnServer": "EmailAddress",
                                "dataType": "String",
                                "isNullable": false,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": "",
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "password",
                                "nameOnServer": "Password",
                                "dataType": "String",
                                "isNullable": false,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": "",
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "salt",
                                "nameOnServer": "Salt",
                                "dataType": "String",
                                "isNullable": true,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            }
                        ],
                        "navigationProperties": [
                            {
                                "name": "token",
                                "nameOnServer": "Token",
                                "entityTypeName": "AccessToken:#HC.TripData.Domain",
                                "isScalar": true,
                                "associationName": "Driver_Token",
                                "foreignKeyNames": [],
                                "foreignKeyNamesOnServer": [],
                                "validators": []
                            },
                            {
                                "name": "cars",
                                "nameOnServer": "Cars",
                                "entityTypeName": "Car:#HC.TripData.Domain",
                                "isScalar": false,
                                "associationName": "Driver_Cars",
                                "foreignKeyNames": [],
                                "foreignKeyNamesOnServer": [],
                                "validators": []
                            }
                        ],
                        "autoGeneratedKeyType": "Identity",
                        "validators": []
                    },
                    "AccessToken:#HC.TripData.Domain": {
                        "name": "AccessToken:#HC.TripData.Domain",
                        "shortName": "AccessToken",
                        "namespace": "HC.TripData.Domain",
                        "defaultResourceName": "AccessTokens",
                        "dataProperties": [
                            {
                                "name": "accessTokenId",
                                "nameOnServer": "AccessTokenId",
                                "dataType": "Int64",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": 0,
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "integer"
                                    }
                                ],
                                "isPartOfKey": true
                            },
                            {
                                "name": "issuedOn",
                                "nameOnServer": "IssuedOn",
                                "dataType": "DateTime",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": "1899-12-31T23:00:00.000Z",
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "date"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "expiresOn",
                                "nameOnServer": "ExpiresOn",
                                "dataType": "DateTime",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": "1899-12-31T23:00:00.000Z",
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "date"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "token",
                                "nameOnServer": "Token",
                                "dataType": "String",
                                "isNullable": true,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            }
                        ],
                        "navigationProperties": [],
                        "autoGeneratedKeyType": "Identity",
                        "validators": []
                    },
                    "Trip:#HC.TripData.Domain": {
                        "name": "Trip:#HC.TripData.Domain",
                        "shortName": "Trip",
                        "namespace": "HC.TripData.Domain",
                        "defaultResourceName": "Trips",
                        "dataProperties": [
                            {
                                "name": "tripId",
                                "nameOnServer": "TripId",
                                "dataType": "Int64",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": 0,
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "integer"
                                    }
                                ],
                                "isPartOfKey": true
                            },
                            {
                                "name": "startMilage",
                                "nameOnServer": "StartMilage",
                                "dataType": "Int32",
                                "isNullable": true,
                                "maxLength": null,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "int32"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "endMilage",
                                "nameOnServer": "EndMilage",
                                "dataType": "Int32",
                                "isNullable": true,
                                "maxLength": null,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "int32"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "dateTime",
                                "nameOnServer": "DateTime",
                                "dataType": "DateTime",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": "1899-12-31T23:00:00.000Z",
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "date"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "placeOfDeparture",
                                "nameOnServer": "PlaceOfDeparture",
                                "dataType": "String",
                                "isNullable": true,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "destination",
                                "nameOnServer": "Destination",
                                "dataType": "String",
                                "isNullable": true,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "departureZipCode",
                                "nameOnServer": "DepartureZipCode",
                                "dataType": "String",
                                "isNullable": true,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "destinationZipCode",
                                "nameOnServer": "DestinationZipCode",
                                "dataType": "String",
                                "isNullable": true,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "description",
                                "nameOnServer": "Description",
                                "dataType": "String",
                                "isNullable": true,
                                "maxLength": null,
                                "fixedLength": false,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "string"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "tripType",
                                "nameOnServer": "TripType",
                                "dataType": "Int32",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": 0,
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "int32"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "driverId",
                                "nameOnServer": "DriverId",
                                "dataType": "Int64",
                                "isNullable": false,
                                "maxLength": null,
                                "defaultValue": 0,
                                "validators": [
                                    {
                                        "validatorName": "required"
                                    },
                                    {
                                        "validatorName": "integer"
                                    }
                                ],
                                "isPartOfKey": false
                            },
                            {
                                "name": "carId",
                                "nameOnServer": "CarId",
                                "dataType": "Int64",
                                "isNullable": true,
                                "maxLength": null,
                                "defaultValue": null,
                                "validators": [
                                    {
                                        "validatorName": "integer"
                                    }
                                ],
                                "isPartOfKey": false
                            }
                        ],
                        "navigationProperties": [
                            {
                                "name": "driver",
                                "nameOnServer": "Driver",
                                "entityTypeName": "Driver:#HC.TripData.Domain",
                                "isScalar": true,
                                "associationName": "Trip_Driver",
                                "foreignKeyNames": [
                                    "driverId"
                                ],
                                "foreignKeyNamesOnServer": [
                                    "DriverId"
                                ],
                                "validators": []
                            }
                        ],
                        "autoGeneratedKeyType": "Identity",
                        "validators": []
                    }
                },
                "_shortNameMap": {
                    "Car": "Car:#HC.TripData.Domain",
                    "Driver": "Driver:#HC.TripData.Domain",
                    "AccessToken": "AccessToken:#HC.TripData.Domain",
                    "Trip": "Trip:#HC.TripData.Domain"
                },
                "_id": 0,
                "_typeRegistry": {},
                "_incompleteTypeMap": {
                    "Driver:#HC.TripData.Domain": {
                        "Driver_Token": {
                            "name": "token",
                            "nameOnServer": "Token",
                            "entityTypeName": "AccessToken:#HC.TripData.Domain",
                            "isScalar": true,
                            "associationName": "Driver_Token",
                            "foreignKeyNames": [],
                            "foreignKeyNamesOnServer": [],
                            "validators": []
                        }
                    },
                    "AccessToken:#HC.TripData.Domain": {},
                    "Trip:#HC.TripData.Domain": {
                        "Trip_Driver": {
                            "name": "driver",
                            "nameOnServer": "Driver",
                            "entityTypeName": "Driver:#HC.TripData.Domain",
                            "isScalar": true,
                            "associationName": "Trip_Driver",
                            "foreignKeyNames": [
                                "driverId"
                            ],
                            "foreignKeyNamesOnServer": [
                                "DriverId"
                            ],
                            "validators": []
                        }
                    }
                }
            };
        }
        

     //   var orgfetchMetadata = function () {
            //  meta = manager.fetchMetadata();
            //setTimeout(function() {
            //    var metadataAsString = manager.metadataStore.exportMetadata();
            //    window.localStorage.setItem("metadata", metadataAsString);
            //}, 1000);
            //return meta;
      //  };
        //#endregion
    });