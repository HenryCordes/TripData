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

            showProgressBar();
            datacontext.syncWithServer()
                .then(showSuccess)
                .then(activate)
                .fail(showFailure);
            
            function showSuccess(result) {
                hideProgressBar();
                return dialog.showMessage('Sync succeeded', null, 'Sync', 'OK');
            }
            
            function showFailure() {
                hideProgressBar();
                return dialog.showMessage('Sync failed', null, 'Sync error', 'OK');
            }
            
            function showProgressBar() {
                $('#progressbar').fadeIn();
                
                var progress = setInterval(function () {
                    var $bar = $('.bar');
                    var totalWidth = $('.progress-container').width();

                    if (totalWidth <= $bar.width()) {
                        clearInterval(progress);
                        $('.progress').removeClass('active');
                    } else {
                        $bar.width($bar.width() + 10);
                    }

                    $bar.text(Math.round(($bar.width() / totalWidth * 100)) + "%");
                }, 100);
            }
            
            function hideProgressBar() {
                $('#progressbar').fadeOut();
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