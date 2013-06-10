define(
    function () {

        var localdatastore = {
            storeDriver: storeDriver,
            getDriver: getDriver,
            deleteDriver: deleteDriver,
            storeChanges: storeChanges,
            getChanges: getChanges,
            deleteChanges: deleteChanges,
            storeLastEntry: storeLastEntry,
            storeCurrentTrip: storeCurrentTrip,
            getCurrentTrip: getCurrentTrip,
            deleteCurrentTrip: deleteCurrentTrip,
            storePlace: storePlace,
            getPlaces: getPlaces,
            deletePlaces: deletePlaces,
            storePlaceToSelectState: storePlaceToSelectState,
            getPlaceToSelectState: getPlaceToSelectState,
            deletePlaceToSelectState: deletePlaceToSelectState
        };

        return localdatastore;
        
        function storeDriver(driver) {
            if (driver && driver.Email) {
                amplify.store('driver', {
                    id: driver.DriverId,
                    email: driver.Email,
                    firstName: driver.FirstName,
                    lastName: driver.LastName,
                    currentCarId: driver.CurrentCarId,
                    identifier: driver.AccessToken,
                    password: null
                });
                return driver;
            } else if (driver() && driver().email) {
                amplify.store('driver', {
                    id: driver().id,
                    email: driver().email,
                    firstName: driver().firstName,
                    lastName: driver().lastName,
                    currentCarId: driver().currentCarId,
                    identifier: driver().identifier,
                    password: null
                });
                return driver;
            }
            return null;
        }
        
        function getDriver() {
           return amplify.store('driver');
        }
        
        function deleteDriver() {
            amplify.store('driver', null);
        }
        
        function storeChanges(changes) {
            amplify.store('changes', changes);
        }
        
        function getChanges() {
            return amplify.store('changes');
        }
        function deleteChanges() {
            return amplify.store('changes', null);
        }
        
        function storeLastEntry(endMilage, destination) {
            amplify.store('lastEntry', {
                endMilage: endMilage,
                destination: destination
            });
        }

       
        function storeCurrentTrip(trip) {
            amplify.store('currentTrip', {
                tripId: trip().tripId(),
                startMilage: trip().startMilage(),
                endMilage: trip().endMilage(),
                dateTime: trip().dateTime(),
                placeOfDeparture: trip().placeOfDeparture(),
                destination: trip().destination(),
                description: trip().description(),
                tripType: trip().tripType(),
                driverId: trip().driverId()
            });
        }

        function getCurrentTrip() {
            return amplify.store('currentTrip');
        }
        function deleteCurrentTrip() {
            return amplify.store('currentTrip', null);
        }
        

        function getPlaces() {
           return amplify.store('places');
        }
        
        function storePlace(place) {
            var storedPlaces = amplify.store('places');
            if (storedPlaces === undefined || storedPlaces.length === 0) {
                storedPlaces = new Array();
                storedPlaces[0] = { 'place': place };
            } else {
                storedPlaces.push({ 'place': place });
            }
            
            return amplify.store('places', storedPlaces);
        }
        
        function deletePlaces() {
            return amplify.store('places', null);
        }
        
        function storePlaceToSelectState(state) {
            amplify.store('placeToSelectState', state);
        }
        
        function getPlaceToSelectState() {
            return amplify.store('placeToSelectState');
        }

        function deletePlaceToSelectState() {
            return amplify.store('placeToSelectState', null);
        }
});