define(['services/logger', 'services/authentication', 'config'], function (logger, authentication, config) {
    var vm = {
        activate: activate,
        title: 'Login',
        email: ko.observable(),
        password: ko.observable(),
        rememberme: ko.observable(),
        login: login
    };

    return vm;
    
   //#region Internal Methods
    function login() {
        var logonModel = {'Email': this.email(), 'Password': this.password()};
        authentication.login(logonModel, '#/'+ config.startModule);
        this.password('');
    }


    function activate() {
        logger.log('Login Activated', null, 'login', true);
        return true;
    }
    //#endregion
});