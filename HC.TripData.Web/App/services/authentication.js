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
    
    function login (userInfo, navigateToUrl) {
        //if (!this.canLogin()) {
        //    return system.defer(function (dfd) {
        //        dfd.reject();
        //    }).promise();
        //}
        var jqxhr = $.post("/api/login", userInfo)
            .done(function (data) {
                if (data.Success == true) {
                    alert(data.Token);
                    if (!!navigateToUrl) {
                        router.navigateTo(navigateToUrl);
                    } else {
                        return true;
                    }
                } else {
                    return data;
                }
            })
            .fail(function (data) {
                return data;
            });

        return jqxhr;
    }
    
    function register(userInfo) {
        //if (!this.canLogin()) {
        //    return system.defer(function (dfd) {
        //        dfd.reject();
        //    }).promise();
        //}
        var jqxhr = $.put("/api/login", userInfo)
            .done(function (data) {
                if (data.Success == true) {
                    alert(data.Token);
                    if (!!navigateToUrl) {
                        router.navigateTo(navigateToUrl);
                    } else {
                        return true;
                    }
                } else {
                    return data;
                }
            })
            .fail(function (data) {
                return data;
            });

        return jqxhr;
    }

});

         