define(['durandal/app',
        'services/model',
        'services/localdatastore', 
        'durandal/plugins/router',
        'services/logger'],
    function (app, model ,localdatastore, router, logger) {

        var places = ko.observableArray(),
            activate = function() {
                logger.log('Places Activated', null, 'places', true);

                places(localdatastore.getPlaces());

                document.getElementById('header-title').innerText = 'Select a place';
                app.trigger('navigation:change', 'places');
                return true;
            },
            selectPlace = function (place) {
                var placeType = localdatastore.getPlaceToSelectState();
                var localTrip = localdatastore.getCurrentTrip();
                var trip = ko.observable();
                trip(new model.Trip(localTrip));
                
                switch(placeType) {
                    case 'departure':
                        trip().placeOfDeparture(place.place);
                        break;
                    case 'destination':
                        trip().destination(place.place);
                        break;
                }
                localdatastore.storeCurrentTrip(trip);
                router.navigateTo('#/trip');
            };
        
        var vm = {
            activate: activate,
            places: places,
            selectPlace: selectPlace,
            title: 'Places'
        };

        return vm;
});