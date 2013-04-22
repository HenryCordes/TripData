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
                .done(function (data) {
                    if (data.Success == true) {
                        app.trigger('accesstoken:new', data.AccessToken);
                        router.navigateTo(successRoute);
                    } else {
                        alert('no-success');
                    }
                })
                .fail(function (data) {
                    alert('error' + data);
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
                        app.trigger('accesstoken:new', result.AccessToken);
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
            var data = { 'token': cookie.getCookie('tripdata-accesstoken') };
  
            
            var jqxhr = $.ajax({
                url: "/api/security",
                type: 'POST',
                data: data,
                success: function (result) {
                    if (result.Success == true) {
                        if (result.AccessToken != accessToken) {
                            app.trigger('accesstoken:new', result.AccessToken);
                        }
                        succesCallback;
                    } else {
                        router.navigateTo('#/account/login');
                    }
                },
                error: (function (result) {
                    alert('error' + result);
                    router.navigateTo('#/account/login');
                })
            });

            return jqxhr;
        }
});

         