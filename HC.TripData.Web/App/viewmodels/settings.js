define(['services/logger'], function (logger) {
    var vm = {
        activate: activate,
        title: 'Settings',
        settings: {}
    };

    return vm;


    //#region Internal Methods
    function activate() {
        logger.log('Settings Activated', null, 'settings', true);
        return true;
    }

    //#endregion
});
