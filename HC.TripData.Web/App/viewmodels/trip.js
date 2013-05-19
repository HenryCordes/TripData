define(['services/logger', 'services/datacontext', 'durandal/plugins/router', 'services/authentication', 'services/localdatastore', 'config'],
    function (logger, datacontext, router, authentication, localdatastore, config) {

        var isSaving = ko.observable(false),
            trip = ko.observable(),
           // cars = ko.observableArray(),

            activate = function () {
                trip(datacontext.createTrip());
                logger.log('Trip Activated', null, 'trip', true);
                document.getElementById('header-title').innerText = 'Enter Trip';
                $('ul#navigation > li').removeClass('active');
                $('ul#navigation > li[data-nav="trip"]').addClass('active');
                return true; 
            },
            canActivate = function() {
                var driver = localdatastore.getDriver();
                if (driver && driver.id > 0) {
                    logger.log('Trip Activated', null, 'trip', true);
                    return true;
                } else {
                    logger.log('Logged in driver NULL TRIP', null, true);
                    router.navigateTo('#/' + config.startModule, 'replace');
                    return false;
                }
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

                isSaving(true);
                return Q.fcall(datacontext.saveLocal)
                    .then(goToEditView).fin(complete);

                function goToEditView() {
                    amplify.store('lastEntry', {
                        endMilage: trip().endMilage(),
                        destination: trip().destination()
                    });
                    activate();
                }

                function complete() {
                    isSaving(false);
                }
        };

    

    var vm = {
        canActivate: canActivate,
        activate: activate,
        canSave: canSave,
        cancel: cancel,
        hasChanges: hasChanges,
        trip: trip,
        save: save,
        title: 'Trip'
    };

    return vm;
});