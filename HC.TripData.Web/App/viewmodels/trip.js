define(['durandal/app',
        'services/logger',
        'services/datacontext',
        'durandal/plugins/router',
        'services/authentication',
        'services/localdatastore',
        'config'],
    function (app, logger, datacontext, router, authentication, localdatastore, config) {

        var isSaving = ko.observable(false),
            trip = ko.observable(),
           // cars = ko.observableArray(),

            activate = function () {
                var localTrip = localdatastore.getCurrentTrip();
                if (localTrip && localTrip.startMilage > 0) {
                    trip(localTrip);
                } else {
                    trip(datacontext.createTrip());
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
                localdatastore.storeCurrentTrip(trip());
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
            save = function () {

                if (!trip().entityAspect.validateEntity()) {
                    alert('validation');
                    return null;
                }
                
                isSaving(true);
                return Q.fcall(datacontext.saveLocal)
                        .then(storeLastEntry)
                        .then(activate)
                        .fin(complete);

                function storeLastEntry() {
                    localdatastore.storeLastEntry(parseInt(trip().endMilage(),
                                                  trip().destination()));
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
            title: 'Trip'
        };
        
      //  vm.errors = ko.validation.group(vm);

    return vm;
});