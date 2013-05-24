define(['config', 'durandal/system', 'services/logger'],
    function (config, system, logger) {
        var nulloDate = new Date(1900, 0, 1);
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
            orderBy: orderBy
        };

        return model;

        //#region Internal Methods
        
        function createGreaterThanStartMilageValidator() {
            var name = 'greaterThanStartMilageValidator';
            var ctx = { messageTemplate: "EndMilage: '%endMilage%' must be greater than StartMilage" };
            var val = new Validator(name, valFunction, ctx);
            log('GreaterThanStartMilageValidator Validator created');
            return val;

            function valFunction(entity, context) {
                var startMilage = entity.getProperty("StartMilage");
                var endMilage = entity.getProperty("EndMilage");
                context.endMilage = endMilage;
                return (endMilage > startMilage);
            }
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
        }
        
        function tripValidationConfig(metadataStore) {
            var greaterThanStartMilageValidator = createGreaterThanStartMilageValidator();
            Validator.register(greaterThanStartMilageValidator);

            tripValidationConfig(metadataStore);
            
            var tripType = metadataStore.getEntityType("Trip");
            tripType.getProperty("StartMilage").validators.push(Validator.required);
            tripType.getProperty("EndMilage").validators.push(Validator.required);
            tripType.getProperty("DateTime").validators.push(Validator.required);
            tripType.getProperty("PlaceOfDeparture").validators.push(Validator.required);
            tripType.getProperty("Destination").validators.push(Validator.required);
            tripType.validators.push(greaterThanStartMilageValidator);
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