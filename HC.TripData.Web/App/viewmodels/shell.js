define(['durandal/system',
        'durandal/plugins/router',
        'services/datacontext',
        'services/localdatastore',
        'services/logger',
        'services/authentication',
        'config'],
    function (system,
              router,
              datacontext,
              localdatastore,
              logger,
              authentication,
              config) {
        var shell = {
            activate: activate,
            router: router
        };
        
        return shell;
        
        //#region Internal Methods
        function activate() {
            return checkAccess().fail(failInit);
        }
        
        function failInit() {
            log('Could not load app', null, true);
        }

        function checkAccess() {
            return Q.fcall(initializeDatacontext)
                    .then(getLoggedInDriver)
                    .then(checkToken)
                    .then(boot);

            function checkToken(localDriver) {
                if (localDriver === null) {
                    log('CheckToken has NO driver ', null, true);
                    return authentication.checkAccess(
                        function (result) {
                            if (result) {
                                localdatastore.storeDriver(result);
                                return result;
                            } else {
                                return null;
                            }
                        },
                        function() {
                            return null;
                        });
                } else {
                    log('CheckToken has driver id: ' + localDriver.id, null, true);
                    return localDriver;
                }
            }

            function getLoggedInDriver() {
                var driver = localdatastore.getDriver();
                if (driver && driver.id > 0) {
                    log('Logged in driver id: ' + driver.id, null, true);
                    return driver;
                } else {
                    log('Logged in driver NULL', null, true);
                    return null;
                }
            }
            
            function initializeDatacontext() {
                return datacontext.fetchMetadata();
            }
            
            function boot(driver) {
                log('Trip Data Loaded!', null, true);
                router.map(config.routes);
                //We need a timeout here, otherwise the metadata is not ready at the moment of initializing the trip viewmodel
                setTimeout(function() {
                    if (driver) {
                        log('Router.activate ' + config.startModule);
                        return router.activate(config.startModule);
                    } else {
                        log('Router.activate account/login');
                        return router.activate('account/login');
                    }
                }, 700);
            }
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });