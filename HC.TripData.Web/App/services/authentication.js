define(['durandal/system',
        'durandal/app',
        'services/logger',
        'durandal/plugins/router',
        'services/localdatastore',
        'services/alert',
        'config'],
    function (system, app, logger, router, localdatastore, alert, config) {

        var authentication = {
            login: login,
            register: register,
            logout: logout,
            checkAccess: checkAccess
        };

        return authentication;
        
        function login (userInfo, successRoute) {

            var jqxhr = $.post(config.remoteServiceUrl + '/api/account', userInfo)
                .done(function (result) {
                    if (result.Success === true) {
                        logger.log('login sucess id ' + result.DriverId, null, true);
                        localdatastore.storeDriver(result);
                        processAccessToken();
                        router.navigateTo(successRoute);
                    } else {
                        logger.log('login no-success', null, true);
                        alert.showMessage('Combination name and password invalid!', null, 'Login');
                    }
                })
                .fail(function (result) {
                    logger.log('error login! ' + result.status + ' - ' + result.statusText, null, true);
                    alert.showMessage('Oops an error occured while logging in!', null, 'Login');
                });

            return jqxhr;
        }
    
        function register(userInfo, successRoute) {
            
            var jqxhr = $.ajax({
                url: config.remoteServiceUrl + '/api/account',
                type: 'PUT',
                data: userInfo,
                success: function (result) {
                    if (result.Success === true) {
                        logger.log('register sucess id ' + result.DriverId, null, true);
                        localdatastore.storeDriver(result);
                        processAccessToken();
                        router.navigateTo(successRoute);
                    } else {
                        logger.log('no-success', null, true);
                        alert.showMessage('Oops something went wrong, try again', null, 'Register');
                    }
                },
                error: (function (result) {
                    logger.log('error register! ' + +result.status + ' - ' + result.statusText, null, true);
                    alert.showMessage('Oops an error occured while registering', null, 'Register');
                })
            });
   
            return jqxhr;
        }

        function checkAccess(successCallback, noAccessCallback) {
            var driver = localdatastore.getDriver();
            if (driver) {
                $.ajax({
                    url: config.remoteServiceUrl + '/api/security',
                    type: 'POST',
                    data: driver.identifier,
                    success: function(result) {
                        if (result.Success === true) {
                            logger.log('checkAccess success ', null, true);
                            successCallback(result);
                        } else {
                            logger.log('checkAccess no-success ', null, true);
                            noAccessCallback();
                        }
                    },
                    error: (function(result) {
                        logger.log('checkAccess error! ' + result.status + ' - ' + result.statusText, null, true);

                        noAccessCallback();
                    })
                });
            } else {
                logger.log('checkAccess no-success ', null, true);
                noAccessCallback();
            }
        }
        
        function logout() {      
            var driver = localdatastore.getDriver();
            var jqxhr = $.ajax({
                url: config.remoteServiceUrl +'/api/security',
                type: 'DELETE',
                data: driver.identifier,
                success: function (result) {  
                    if (result.Success === true) {
                        processAccessToken();
                        localdatastore.deleteDriver();
                        router.navigateTo('#/account/login');
                    } else {
                        router.navigateTo('#/account/login');
                    }
                },
                error: (function (result) {
                    logger.log('error logout! ' + result, null, true);
                    alert.showMessage('Oops an error occured while logging out', null, 'Logout');
                    router.navigateTo('#/account/login');
                })
            });

            return jqxhr;
        }

        function processAccessToken() {
            app.trigger('accesstoken:new');
        }
});

         