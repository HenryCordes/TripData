define(['services/logger', 'services/authentication', 'config'], function (logger, authentication, config) {
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
            var logonModel = { 'Email': this.email(), 'Password': this.password() };
            authentication.register(logonModel, '#/' + config.startModule);
            this.password('');
        } else {
            alert('Passwords do not match');
        }
    }

   
    function activate() {
        logger.log('Register Activated', null, 'register', true);
        return true;
    }
    //#endregion
});