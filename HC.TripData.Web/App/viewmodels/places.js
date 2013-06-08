define(['durandal/app',
        'services/logger'],
    function (app,logger) {
    var vm = {
        activate: activate,
        title: 'Places'
    };

    return vm;

    //#region Internal Methods
    function activate() {
        logger.log('Places Activated', null, 'places', true);
        
        document.getElementById('header-title').innerText = 'Select a place';
        app.trigger('navigation:change', 'places');
        return true;
    }
    //#endregion
});