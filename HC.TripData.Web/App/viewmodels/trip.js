define(['services/logger', 'services/datacontext'], function (logger, dataContext) {
    var vm = {
        activate: activate,
        trip: ko.observable(),
        title: 'Trip'
    };

    return vm;

    //#region Internal Methods
    function activate() {
        vm.trip = dataContext.createTrip();
        logger.log('Trip Activated', null, 'trip', true);
        return true;
    }
    //#endregion
});