define(['services/logger'], function (logger) {
    var vm = {
        activate: activate,
        title: 'Settings'
    };

    return vm;

    //#region Internal Methods
    function activate() {
        logger.log('Settings Activated', null, 'settings', true);
        return true;
    }
    //#endregion
});