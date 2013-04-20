define(['services/logger', 'services/authentication' ], function (logger, authentication) {
    var vm = {
        activate: activate,
        title: 'Login',
        email: ko.observable(),
        password: ko.observable(),
        rememberme: ko.observable(),
        login: login,
        showRegister: showRegister,
        showLogin: showLogin
    };

    return vm;
    
   //#region Internal Methods
    function login() {
        var logonModel = {'Email': vm.email(), 'Password': vm.password()};

        authentication.login(logonModel, '');
    }

    function showRegister() {
        $("#login-section").hide("slide", function () {
            $("#register-section").show("slide", function () {
                $("#RegisterEmail").focus();
            });
        });
    }
    
    function showLogin() {
        $("#register-section").hide("slide", function () {
            $("#login-section").show("slide", function () {
                $("#Email").focus();
            });
        });
    }
    
    function activate() {
        logger.log('Login Activated', null, 'login', true);
        return true;
    }
    //#endregion
});