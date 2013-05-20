define(['durandal/app', 'services/logger', 'services/datacontext'], function (app, logger, datacontext) {

    var numberOfTrips = ko.observable(),
        changes = ko.observable(),
        activate = function() {
            logger.log('Sync Activated', null, 'sync', true);
            document.getElementById('header-title').innerText = 'Sync trips';
            app.trigger('navigation:change', 'sync');

            changes = ko.observable(datacontext.getChanges());
            if (changes()) {
                var number = changes().length;
                numberOfTrips = ko.observable(10);
            }
            return true;
        },
        sync = function() {
            datacontext.syncWithServer();
        };
 
    
    var vm = {
        activate: activate,
        title: 'Sync',
        numberOfTrips: numberOfTrips,
        sync: sync,
        changes: changes
    };

    return vm;
});