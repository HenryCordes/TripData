define(['services/logger', 'services/authentication' ], function (logger, authentication) {
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
        var logonModel = {'Email': vm.email(), 'Password': vm.password()};

        authentication.login(logonModel, '');
    }


    function activate() {
        logger.log('Login Activated', null, 'login', true);
        return true;
    }
    //#endregion
});