define(['durandal/system', 'durandal/plugins/router', 'services/datacontext', 'services/logger', 'services/authentication', 'config'],
    function (system, router, datacontext, logger, authentication, config) {
        var shell = {
            activate: activate,
            router: router
        };
        
        return shell;

        //#region Internal Methods
        function activate() {
            return boot().fail(failInit);
          //  then(boot).fail(failInit);
        }
        
        function checkAccess() {
            return true;
          //  return authentication.checkAccess(function () { router.activate(config.startModule); });

        }

        function boot() {
            router.map(config.routes);
            log('Trip Data Loaded!', null, true);
           return  router.activate(config.startModule);
         //   return router.activate(config.startModule);
        }
        
        function failInit() {
            log('Could not load app', null, true);
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });