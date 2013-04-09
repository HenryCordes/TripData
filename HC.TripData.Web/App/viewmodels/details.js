define(['services/logger'], function (logger) {
    var vm = {
        activate: activate,
        title: 'Details'
    };

    return vm;

    //#region Internal Methods
    function activate() {
        logger.log('Details Activated', null, 'details', true);
        return true;
    }
    //#endregion
});