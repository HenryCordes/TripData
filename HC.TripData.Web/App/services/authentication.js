define([
    'durandal/system',
    'durandal/app',
    'services/logger',
    'durandal/plugins/router',
    'services/cookie'],
    function (system, app, logger, router, cookie) {

        var authentication = {
            login: login,
            register: register,
            logout: logout,
            checkAccess: checkAccess,
            handleUnauthorizedAjaxRequests: handleUnauthorizedAjaxRequests
        };

        return authentication;
        
        function  handleUnauthorizedAjaxRequests (callback) {
            if (!callback) {
                return;
            }
            $(document).ajaxError(function (event, request, options) {
                if (request.status === 401) {
                    callback();
                }
            });
        }
    
        function login (userInfo, successRoute) {

            var jqxhr = $.post('/api/account', userInfo)
                .done(function (result) {
                    if (result.Success === true) {
                        logger.log('login sucess ', null, true);
                        storeDriverDetails(result);
                        processAccessToken();
                        router.navigateTo(successRoute);
                    } else {
                        logger.log('login no-success', null, true);
                    }
                })
                .fail(function (result) {
                    logger.log('error login! ' + result, null, true);
                });

            return jqxhr;
        }
    
        function register(userInfo, successRoute) {
            
            var jqxhr = $.ajax({
                url: '/api/account',
                type: 'PUT',
                data: userInfo,
                success: function (result) {
                    if (result.Success === true) {
                        storeDriverDetails(result);
                        processAccessToken();
                        router.navigateTo(successRoute);
                    } else {
                        logger.log('no-success', null, true);
                    }
                },
                error: (function (result) {
                    logger.log('error register! ' + result, null, true);
                })
            });
   
            return jqxhr;
        }

        function checkAccess(successCallback, noAccessCallback) {
            var accessToken = { 'Token': cookie.getCookie('tripdata-accesstoken') };
            
             $.ajax({
                url: '/api/security',
                type: 'POST',
                data: accessToken,
                success: function (result) {
                    if (result.Success === true) {
                        logger.log('checkAccess success ', null, true);
                        successCallback(result);
                    } else {
                        logger.log('checkAccess no-success ', null, true);
                        noAccessCallback();
                    }
                },
                error: (function (result) {
                    logger.log('checkAccess error! ' + result, null, true);

                    noAccessCallback();
                })
            });
        }
        
        function logout() {      
            var accessToken = { 'Token': cookie.getCookie('tripdata-accesstoken') };
            var jqxhr = $.ajax({
                url: '/api/security',
                type: 'DELETE',
                data: accessToken,
                success: function (result) {  
                    if (result.Success === true) {
                        processAccessToken();
                        emptyDriverDetails();
                        router.navigateTo('#/account/login');
                    } else {
                        router.navigateTo('#/account/login');
                    }
                },
                error: (function (result) {
                    logger.log('error logout! ' + result, null, true);
                    router.navigateTo('#/account/login');
                })
            });

            return jqxhr;
        }

        function storeDriverDetails(driver) {
            amplify.store('driver', {
                id: driver.driverId,
                email: driver.driverEmail
            });
        }

        function emptyDriverDetails(driver) {
            amplify.store('driver', {
                id: null,
                email: null
            });
        }

        function processAccessToken() {
            app.trigger('accesstoken:new');
        }
});

         