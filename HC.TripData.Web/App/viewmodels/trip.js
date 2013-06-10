define(['durandal/app',
        'services/logger',
        'services/datacontext',
        'durandal/plugins/router',
        'services/model',
        'services/authentication',
        'services/localdatastore',
        'config'],
    function (app, logger, datacontext, router, model, authentication, localdatastore, config) {

        var isSaving = ko.observable(false),
            trip = ko.observable(),
           // cars = ko.observableArray(),

            activate = function () {
                var localTrip = localdatastore.getCurrentTrip();
                
                if (localTrip && localTrip.startMilage > 0) {
                    trip(new model.Trip(localTrip));
                } else {
                    trip(new model.Trip());
                    model.tripInitializer(trip);
                }
               
                logger.log('Trip Activated', null, 'trip', true);
                document.getElementById('header-title').innerText = 'Enter Trip';
                app.trigger('navigation:change', 'trip');
                return true; 
            },
            canActivate = function() {
                var driver = localdatastore.getDriver();
                if (driver && driver.id > 0) {
                    return true;
                } else {
                    router.navigateTo('#/' + config.startModule, 'replace');
                    return false;
                }
            },
            canDeactivate = function() {
                localdatastore.storeCurrentTrip(trip);
                return true;
            },
            cancel = function (complete) {
                router.navigateBack();
            },
            hasChanges = ko.computed(function () {
                return datacontext.hasChanges();
            }),
            canSave = ko.computed(function () {
                return hasChanges() && !isSaving();
            }),
            getPlaceOfDeparture = function () {
           //     localdatastore.storeCurrentTrip(trip);
                localdatastore.storePlaceToSelectState('departure');
                router.navigateTo('#/places');
             },
            getDestination = function () {
          //      localdatastore.storeCurrentTrip(trip);
                localdatastore.storePlaceToSelectState('destination');
                router.navigateTo('#/places');
            },
            save = function () {

                if (validateTrip()) {

                    isSaving(true);
                    return Q.fcall(mapTripToDatacontext)
                        .then(datacontext.saveLocal)
                        .then(storeLastEntry)
                        .then(storePlaces)
                        .then(deleteCurrentTrip)
                        .then(activate)
                        .fin(complete);
                } 

                function validateTrip() {
                    if (trip().startMilage() === '') {
                        alert('startMilage is required');
                        return false;
                    }
                    
                    if (trip().endMilage() == undefined || trip().endMilage() === '') {
                        alert('endMilage is required');
                        return false;
                    }
                    
                    if (trip().dateTime() == undefined) {
                        alert('dateTime is required');
                        return false;
                    }
                    if (trip().placeOfDeparture() == undefined || trip().placeOfDeparture() === '') {
                        alert('placeOfDeparture is required');
                        return false;
                    }
                    if (trip().destination() == undefined || trip().destination() === '') {
                        alert('destination is required');
                        return false;
                    }
                    if (trip().description() == undefined || trip().description() === '') {
                        alert('description is required');
                        return false;
                    }
           

                    if (parseInt(trip().startMilage()) >= parseInt(trip().endMilage())) {
                        alert('StartMilage must be smaller than EndMilage');
                        return false;
                    }

                    return true;
                }
                
                function mapTripToDatacontext() {
                    var dcTrip = datacontext.createTrip();
                    
                    dcTrip.startMilage(parseInt(trip().startMilage()));
                    dcTrip.endMilage(parseInt(trip().endMilage()));
                    dcTrip.dateTime(trip().dateTime());
                    dcTrip.placeOfDeparture(trip().placeOfDeparture());
                    dcTrip.destination(trip().destination());
                    dcTrip.description(trip().description());
                    dcTrip.tripType(trip().tripType());
                    dcTrip.driverId(trip().driverId());
                    return true;
                }
                
                function storeLastEntry() {
                    return localdatastore.storeLastEntry(parseInt(trip().endMilage()),
                                                         trip().destination());
                }
                
                function storePlaces() {
                    localdatastore.storePlace(trip().placeOfDeparture());
                    localdatastore.storePlace(trip().destination());

                    return true;
                }
                
                function deleteCurrentTrip() {
                    return localdatastore.deleteCurrentTrip();
                }
                
                function complete() {
                    isSaving(false);
                }
            };
        
       

        var vm = {
            canActivate: canActivate,
            canDeactivate:canDeactivate,
            activate: activate,
            canSave: canSave,
            cancel: cancel,
            hasChanges: hasChanges,
            trip: trip,
            save: save,
            getPlaceOfDeparture: getPlaceOfDeparture,
            getDestination: getDestination,
            title: 'Trip'
        };
        
      //  vm.errors = ko.validation.group(vm);

    return vm;
});