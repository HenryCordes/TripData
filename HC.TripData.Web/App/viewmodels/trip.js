define(['services/logger', 'services/datacontext', 'durandal/plugins/router'],
    function (logger, datacontext, router) {

        var isSaving = ko.observable(false),
            trip = ko.observable(),
           // cars = ko.observableArray(),

            activate = function() {
                trip(datacontext.createTrip());
                logger.log('Trip Activated', null, 'trip', true);
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

                isSaving(true);
                datacontext.saveChanges()
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