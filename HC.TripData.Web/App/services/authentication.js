define([
    'durandal/system',
    'durandal/app',
    'services/logger',
    'durandal/plugins/router',
    'services/cookie'],
    function (system, app, logger, router, cookie){
    
        var authentication = {
            login: login,
            register: register,
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

            var jqxhr = $.post("/api/account", userInfo)
                .done(function (result) {
                    if (result.Success == true) {
                        processAccessToken(result.AccessToken);
                        router.navigateTo(successRoute);
                    } else {
                        alert('no-success');
                    }
                })
                .fail(function (result) {
                    alert('error' + result);
                });

            return jqxhr;
        }
    
        function register(userInfo, successRoute) {

            var jqxhr = $.ajax({
                url: "/api/account",
                type: 'PUT',
                data: userInfo,
                success: function (result) {
                    if (result.Success == true) {
                        processAccessToken(result.AccessToken);
                        router.navigateTo(successRoute);
                    } else {
                        alert('no-success');
                    }
                },
                error: (function (result) {
                    alert('error' + result);
                })
            });
   
            return jqxhr;
        }

        function checkAccess(succesCallback) {
            var accessToken = { 'Token': cookie.getCookie('tripdata-accesstoken') };
            
            var jqxhr = $.ajax({
                url: "/api/security",
                type: 'POST',
                data: accessToken,
                success: function (result) {
                    if (result.Success == true) {
                        if (result.AccessToken != accessToken) {
                            processAccessToken(result.AccessToken);
                        }
                        succesCallback;
                    } else {
 
                        router.navigateTo('#/account/login');
                    }
                },
                error: (function (result) {
                    alert('error' + result);
                    log('error checkAccess!', null, true);
                    router.navigateTo('#/account/login');
                })
            });

            return jqxhr;
        }
        
        function processAccessToken(accessToken) {
            app.trigger('accesstoken:new', accessToken);
            cookie.setCookie('tripdata-accesstoken', accessToken, 14);
        }
});

         