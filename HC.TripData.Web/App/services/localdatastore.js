define(
    function () {

        var localdatastore = {
            storeDriver: storeDriver,
            getDriver: getDriver,
            deleteDriver: deleteDriver,
            storeChanges: storeChanges,
            getChanges: getChanges.length,
            deleteChanges: deleteChanges
        };

        return localdatastore;
        
        function storeDriver(driver) {
            amplify.store('driver', {
                id: driver.DriverId,
                email: driver.Email,
                firstName: driver.FirstName,
                lastName: driver.LastName,
                currentCarId: driver.CurrentCarId,
                identifier: driver.AccessToken,
                password: null
            });
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