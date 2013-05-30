define(['services/logger',
        'services/authentication',
        'config',
        'durandal/plugins/router'],
    function (logger, authentication, config, router) {

        var loginCaption = ko.observable('Login'),
            password = ko.observable(),
            login = function () {
                var self = this;
                loginCaption('Login...');
                var logonModel = { 'Email': this.email(), 'Password': this.password() };

                authentication.login(logonModel, function () {
                                                     self.loginCaption('Login');
                                                     self.password('');
                                                     router.navigateTo('#/' + config.startModule);
                                                 },
                                                 function () {
                                                     self.loginCaption('Login');
                                                     self.password('');
                                                 });
            },
            activate = function() {
                logger.log('Login Activated', null, 'login', true);
                return true;
            };
    
    var vm = {
        activate: activate,
        title: 'Login',
        email: ko.observable(),
        password: password,
        rememberme: ko.observable(),
        loginCaption: loginCaption,
        login: login
    };

    return vm;
});