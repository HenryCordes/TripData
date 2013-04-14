define(['durandal/system', 'durandal/plugins/router', 'services/datacontext', 'services/logger', 'config'],
    function (system, router, datacontext, logger, config) {
        var shell = {
            activate: activate,
            router: router
        };
        
        return shell;

        //#region Internal Methods
        function activate() {
            return datacontext.primeData()
                            .then(boot)
                            .fail(failInit);
        }

        function boot() {
            router.map(config.routes);
            log('Trip Data Loaded!', null, true);
            return router.activate(config.startModule);
        }
        
        function failInit() {
            log('Could not load app', null, true);
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });