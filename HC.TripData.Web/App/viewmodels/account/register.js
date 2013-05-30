define(['services/logger', 'services/authentication', 'config'], function (logger, authentication, config) {

    var registerCaption = ko.observable('Register'),
        email = ko.observable(),
        password = ko.observable(),
        password2 = ko.observable(),
        register = function() {
            var self = this;
            self.registerCaption('Register ...');
            
            if (self.email() == null || self.email() == '' ||
                self.password() == null || self.password() == '' ||
                self.password2() == null || self.password2() == '') {
                alert('All values need to be entered');
                self.registerCaption('Register');
                return;
            }
            if (self.password() === self.password2()) {
                executeRegistering();
            } else {
                alert('Passwords do not match');
                self.registerCaption('Register');
            }
            
            function executeRegistering() {
                var logonModel = { 'Email': self.email(), 'Password': self.password() };
                return authentication.register(logonModel, function () {
                                                                self.registerCaption('Register');
                                                                self.password('');
                                                                self.password2('');
                                                                router.navigateTo('#/' + config.startModule);
                                                           },
                                                           function () {
                                                                self.registerCaption('Register');
                                                           });
            }
        },
        activate = function() {
            logger.log('Register Activated', null, 'register', true);
            return true;
        };
 
    
    var vm = {
        activate: activate,
        title: 'Register',
        email: email,
        password: password,
        password2: password2,
        register: register,
        registerCaption: registerCaption
    };

    return vm;
});