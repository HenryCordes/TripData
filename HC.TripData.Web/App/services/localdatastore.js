define(
    function () {

        var localdatastore = {
            storeDriver: storeDriver,
            getDriver: getDriver,
            deleteDriver: deleteDriver,
            storeChanges: storeChanges,
            getChanges: getChanges,
            deleteChanges: deleteChanges
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
        
});