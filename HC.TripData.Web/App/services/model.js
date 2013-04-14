define(['config', 'durandal/system', 'services/logger'],
    function (config, system, logger) {
        var imageSettings = config.imageSettings;
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
            applyTripValidators: applyTripValidators,
            configureMetadataStore: configureMetadataStore,
            createNullos: createNullos,
            entityNames: entityNames,
            orderBy: orderBy
        };

        return model;

        //#region Internal Methods
        function configureMetadataStore(metadataStore) {
            metadataStore.registerEntityTypeCtor(
                'Car', function () { this.isPartial = false; }, carInitializer);
            metadataStore.registerEntityTypeCtor(
                'Trip', function () { this.isPartial = false; }, tripInitializer);
            metadataStore.registerEntityTypeCtor(
                'Driver', null, driverInitializer);

            referenceCheckValidator = createReferenceCheckValidator();
            Validator.register(referenceCheckValidator);
            log('Validators registered');
        }

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

        function applyTripValidators(metadataStore) {
            var types = ['car', 'trip', 'driver'];
            types.forEach(addValidator);
            log('Validators applied', types);

            function addValidator(propertyName) {
                var tripType = metadataStore.getEntityType('Trip');
                tripType.getProperty(propertyName)
                    .validators.push(referenceCheckValidator);
            }
        }

        function createNullos(manager) {
            var unchanged = breeze.EntityState.Unchanged;

            createNullo(entityNames.car);
            createNullo(entityNames.trip, { datetime: nulloDate, isSessionSlot: true });
            createNullo(entityNames.driver, { firstName: ' [Select a person]' });
  

            function createNullo(entityName, values) {
                var initialValues = values
                    || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
                return manager.createEntity(entityName, initialValues, unchanged);
            }

        }

        function tripInitializer(trip) {
            //trip.tagsFormatted = ko.computed({
            //    read: function () {
            //        var text = trip.tags();
            //        return text ? text.replace(/\|/g, ', ') : text;
            //    },
            //    write: function (value) {
            //        trip.tags(value.replace(/\, /g, '|'));
            //    }
            //});
        }

        function driverInitializer(driver) {
            driver.fullName = ko.computed(function () {
                var fn = driver.firstName();
                var ln = driver.lastName();
                return ln ? fn + ' ' + ln : fn;
            });
        }

        function carInitializer(car) {
            //car.name = ko.computed(function () {
            //    var start = car.start();
            //    var value = ((start - nulloDate) === 0) ?
            //        ' [Select a timeslot]' :
            //        (start && moment.utc(start).isValid()) ?
            //            moment.utc(start).format('ddd hh:mm a') : '[Unknown]';
            //    return value;
            //});
        }

 

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(model), showToast);
        }
        //#endregion
    });