define(['durandal/app',
        'services/logger',
        'services/datacontext',
        'services/alert'], function (app, logger, datacontext, dialog) {

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
        sync = function () {
            datacontext.syncWithServer()
                .then(showSuccess)
                .then(activate)
                .fail(showFailure);
            
            function showSuccess(result) {
                return dialog.showMessage('Sync succeeded', null, 'Sync', 'OK');
            }
            
            function showFailure() {
                return dialog.showMessage('Sync failed', null, 'Sync error', 'OK');
            }
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