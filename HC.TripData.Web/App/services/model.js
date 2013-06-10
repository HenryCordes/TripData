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
            orderBy: orderBy,
            tripInitializer: tripInitializer,
            Trip: trip
        };

        return model;

        //#region Internal Methods
        function trip(currentTrip) {
            var self = this;

            self.tripId = ko.observable();
            if (currentTrip) {
                self.startMilage = ko.observable(currentTrip.startMilage);
                self.endMilage = ko.observable(currentTrip.endMilage);
                self.dateTime = ko.observable(currentTrip.dateTime);
                self.placeOfDeparture = ko.observable(currentTrip.placeOfDeparture);
                self.destination = ko.observable(currentTrip.destination);
                self.description = ko.observable(currentTrip.description);
                self.tripType = ko.observable(currentTrip.tripType);
                self.driverId = ko.observable(currentTrip.driverId);
            } else {
                self.startMilage = ko.observable();
                self.endMilage = ko.observable();
                self.dateTime = ko.observable();
                self.placeOfDeparture = ko.observable();
                self.destination = ko.observable();
                self.description = ko.observable();
                self.tripType = ko.observable();
                self.driverId = ko.observable();
            }
        }
        
        function createGreaterThanStartMilageValidator() {
            var name = 'greaterThanStartMilageValidator';
            var ctx = { messageTemplate: 'EndMilage must be greater than StartMilage' };
            var val = new Validator(name, valFunction, ctx);
            log('GreaterThanStartMilageValidator Validator created');
            return val;

            function valFunction(entity, context) {
                var startMilage = entity.getProperty('StartMilage');
                var endMilage = entity.getProperty('EndMilage');
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
            metadataStore.registerEntityTypeCtor('Trip', null);
            metadataStore.registerEntityTypeCtor('Driver', null);
        }
        
        function tripInitializer(trip) {

            var lastentry = amplify.store('lastEntry');
            if (lastentry) {
                if (lastentry.endMilage) {
                    trip().startMilage(lastentry.endMilage);
                }
                if (lastentry.destination) {
                    trip().placeOfDeparture(lastentry.destination);
                }
            }

            trip().dateTime(new Date());
            trip().tripType('0');
            var driver = amplify.store('driver');
            if (driver) {
                trip().driverId(driver.id);
            }
        }
 
        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(model), showToast);
        }
        
        ////Can be removed when other validation option is active
        //function tripValidationConfig(metadataStore) {
        //    var greaterThanStartMilageValidator = createGreaterThanStartMilageValidator();
        //    Validator.register(greaterThanStartMilageValidator);

        //    var tripType = metadataStore.getEntityType('Trip');
        //    tripType.getProperty('StartMilage').validators.push(Validator.required);
        //    tripType.getProperty('EndMilage').validators.push(Validator.required);
        //    tripType.getProperty('DateTime').validators.push(Validator.required);
        //    tripType.getProperty('PlaceOfDeparture').validators.push(Validator.required);
        //    tripType.getProperty('Destination').validators.push(Validator.required);
        //    tripType.validators.push(greaterThanStartMilageValidator);
        //}
        //#endregion
    });