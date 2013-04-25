﻿define(['durandal/system',  'durandal/plugins/router', 'services/datacontext', 'services/logger', 'services/authentication', 'config'],
    function (system,  router, datacontext, logger, authentication, config) {
        var shell = {
            activate: activate,
            router: router
        };
        
        return shell;
        
        //#region Internal Methods
        function activate() {
            return boot().then(checkAccess).fail(failInit);
        }
        
        function checkAccess() {
            log('checkAccess executed!', null, true);
            return authentication.checkAccess(
                function () {
                    router.navigateTo(config.startModule);
                },
                function() {
                    router.navigateTo('#/account/login');
                });
        }

        function boot() {
            router.map(config.routes);
            log('Trip Data Loaded!', null, true);
           return  router.activate(config.startModule);
        }
        
        function failInit() {
            log('Could not load app', null, true);
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });