define(['services/logger', 'services/authentication'], function (logger, authentication) {
    var vm = {
        activate: activate,
        title: 'Register',
        email: ko.observable(),
        password: ko.observable(),
        password2: ko.observable(),
        register: register
    };

    return vm;

    //#region Internal Methods
    function register() {
        if (vm.password() === vm.password2()) {
            var logonModel = { 'Email': vm.email(), 'Password': vm.password() };
            authentication.register(logonModel, '');
        } else {
            //Show message not equal pass
        }
    }

   
    function activate() {
        logger.log('Register Activated', null, 'register', true);
        return true;
    }
    //#endregion
});