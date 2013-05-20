define(['durandal/app',
        'services/logger',
        'services/localdatastore',
        'services/datacontext',
        'services/alert'],
    function (app, logger, localdatastore, datacontext, dialog) {
   
    var isSaving = ko.observable(false),
        driver = ko.observable(),
        activate = function() {
            driver(localdatastore.getDriver());
            logger.log('Settings Activated', null, 'settings', true);
            document.getElementById('header-title').innerText = 'Settings';
            app.trigger('navigation:change', 'settings');
            return true;
        },
        save = function() {

            isSaving(true);
            return Q.fcall(localdatastore.storeDriver(driver))
                    .then(datacontext.saveLocal)
                    .then(goToEditView).fin(complete);

            function goToEditView() {
               return dialog.showMessage('Save succeeded', null, 'Save', 'OK');
            }

            function complete() {
                isSaving(false);
            }
    };



    var vm = {
        activate: activate,
        title: 'Settings',
        driver: driver,
        save: save,
    };

    return vm;
});
