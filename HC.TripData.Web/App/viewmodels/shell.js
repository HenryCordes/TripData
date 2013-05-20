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
            return Q.fcall(initializeDatacontext)
                    .then(initializeState)
                    .then(getLoggedInDriver)
                    .then(checkToken)
                    .then(boot)
                    .fail(failInit)
                    .fin(adjustBrowserBar);

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
            
            function initializeState() {
                return datacontext.setStateFromLocalStorage();
            }
            
            function boot(driver) {
                log('Trip Data Loaded!', null, true);
                router.map(config.routes);
                //We need a timeout here, otherwise the metadata is not ready at the moment of initializing the trip viewmodel
                setTimeout(function () {
                    if (driver) {
                        log('Router.activate ' + config.startModule);
                        return router.activate(config.startModule);
                    } else {
                        log('Router.activate account/login');
                        return router.activate('account/login');
                    }
                }, 700);
            }


            function adjustBrowserBar() {
                if (/mobi/i.test(navigator.userAgent)) {
                    if (("standalone" in window.navigator) && !window.navigator.standalone) {
                        if (!pageYOffset) {
                            var applicationHost = document.getElementById('applicationHost');
                            applicationHost.style.height =(applicationHost.clientHeight + 122) + 'px';
                            window.scrollTo(0, 0);
                        }
                    }
                }
            }

            function failInit() {
                log('Could not load app', null, true);
            }
        }
        
        
        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });