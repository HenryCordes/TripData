define(['durandal/system',  'durandal/plugins/router', 'services/datacontext', 'services/logger', 'services/authentication', 'config'],
    function (system,  router, datacontext, logger, authentication, config) {
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
                    return authentication.checkAccess(function(result) {
                        if (result) {
                            amplify.store('driver', {
                                id: result.DriverId,
                                email: result.DriverEmail
                            });
                            return result;
                        }
                        return null;
                    });
                }
                return localDriver;
            }

            function getLoggedInDriver() {
                var driver = amplify.store('driver');
                if (driver && driver.id > 0) {
                    return driver;
                } else {
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
        
        //function checkAccessorg() {
        //    log('checkAccess executed!', null, true);
        //    var driver = amplify.store('driver');
        //    if (driver && driver.id > 0) {
        //        return router.activate(config.startModule);
        //    }
        //    return authentication.checkAccess(function (result) {
        //        if (result) {
        //            amplify.store('driver', {
        //                id: result.DriverId,
        //                email: result.DriverEmail
        //            });
        //        }
        //        return result; //router.activate(config.startModule);
        //    }, function () {
        //        return null; // router.activate('account/login');
        //    });
        //}
        //#endregion
    });