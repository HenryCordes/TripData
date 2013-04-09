define(['services/logger'], function (logger) {
    var vm = {
        activate: activate,
        title: 'Home'
    };

    return vm;

    //#region Internal Methods
    function activate() {
        logger.log('Home Activated', null, 'home', true);
        return true;
    }
    //#endregion
});