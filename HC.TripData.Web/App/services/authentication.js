define(function (require) {
    var system = require('durandal/system'),
    app = require('durandal/app'),
    router = require('durandal/plugins/router');
    
    var authentication = {
        login: login,
        register: register,
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

        var jqxhr = $.post("/api/security", userInfo)
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
            url: "/api/security",
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

});

         