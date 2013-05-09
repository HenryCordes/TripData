define(['config', 'durandal/system', 'services/logger'],
    function (config, system, logger) {
        var nulloDate = new Date(1900, 0, 1);
        var referenceCheckValidator;
        var Validator = breeze.Validator;

        var orderBy = {
            trip: 'datetime'
        };

        var entityNames = {
            car: 'Car',
            trip: 'Trip',
            driver: 'Driver'
        };

        var model = {
            configureMetadataStore: configureMetadataStore,
            entityNames: entityNames,
            orderBy: orderBy,
            createNullos: createNullos,
            applySessionValidators: applySessionValidators
        };

        return model;

        //#region Internal Methods
        

        function createReferenceCheckValidator() {
            var name = 'realReferenceObject';
            var ctx = { messageTemplate: 'Missing %displayName%' };
            var val = new Validator(name, valFunction, ctx);
            log('Validators created');
            return val;

            function valFunction(value, context) {
                return value ? value.id() !== 0 : true;
            }
        }

        function applySessionValidators(metadataStore) {
            //var types = ['trip', 'car', 'driver'];
            //types.forEach(addValidator);
            //log('Validators applied', types);

            //function addValidator(propertyName) {
            //    var sessionType = metadataStore.getEntityType('Trip');
            //    sessionType.getProperty(propertyName)
            //        .validators.push(referenceCheckValidator);
            //}
        }
        
        function createNullos(manager) {
            var unchanged = breeze.EntityState.Unchanged;

            createNullo(entityNames.car);
            createNullo(entityNames.trip, { startMilage: 0, endMilage: 0, dateTime: nulloDate});
            createNullo(entityNames.driver);

            function createNullo(entityName, values) {
                var initialValues = values;
              //      || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
                return manager.createEntity(entityName, initialValues, unchanged);
            }

        }
        function configureMetadataStore(metadataStore) {
            metadataStore.registerEntityTypeCtor('Car',null);
            metadataStore.registerEntityTypeCtor('Trip', null, tripInitializer);
            metadataStore.registerEntityTypeCtor('Driver', null);
            
       //     referenceCheckValidator = createReferenceCheckValidator();
      //      Validator.register(referenceCheckValidator); 
        }
        

        function tripInitializer(trip) {

            var lastentry = amplify.store('lastEntry');
            if (lastentry) {
                if (lastentry.endMilage) {
                    trip.startMilage = ko.observable(lastentry.endMilage);
                }
                if (lastentry.destination) {
                    trip.placeOfDeparture = ko.observable(lastentry.destination);
                }
            }
           
            trip.dateTime = ko.observable(new Date());
            var driver = amplify.store('driver');
            if (driver) {
                trip.driverId = ko.observable(driver.id);
            }
        }
 
        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(model), showToast);
        }
        //#endregion
    });