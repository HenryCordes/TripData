define(['durandal/app', 'services/logger', 'services/datacontext'], function (app, logger, datacontext) {

    var numberOfTrips = ko.observable(0),
        changes = null,
        activate = function() {
            logger.log('Sync Activated', null, 'sync', true);
            document.getElementById('header-title').innerText = 'Sync trips';
            app.trigger('navigation:change', 'sync');

            changes = datacontext.getChanges();
            if (changes) {
                numberOfTrips(changes.length);
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