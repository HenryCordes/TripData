define(['durandal/app',
        'services/localdatastore',
        'services/logger'],
    function (app, localdatastore, logger) {

        var places = ko.observableArray(),
            activate = function() {
                logger.log('Places Activated', null, 'places', true);

                places(localdatastore.getPlaces());

                document.getElementById('header-title').innerText = 'Select a place';
                app.trigger('navigation:change', 'places');
                return true;
            };
        
        var vm = {
            activate: activate,
            places: places,
            title: 'Places'
        };

        return vm;
});