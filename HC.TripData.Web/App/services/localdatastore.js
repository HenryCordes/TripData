define(
    function () {

        var localdatastore = {
            storeDriver: storeDriver,
            getDriver: getDriver,
            deleteDriver: deleteDriver
        };

        return localdatastore;
        
        function storeDriver(driver) {
            amplify.store('driver', {
                id: driver.DriverId,
                email: driver.DriverEmail,
                identifier: driver.AccessToken
            });
        }
        
        function getDriver() {
           return amplify.store('driver');
        }
        
        function deleteDriver() {
            amplify.store('driver', null);
        }
        
        
});