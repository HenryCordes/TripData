﻿define(function () {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var imageSettings = {
        imageBasePath: '../content/images/users/',
        unknownDriverImageSource: 'unknown_person.jpg'
    };

    var remoteServiceName = 'api/tripdata';

    var routes = [{
        url: 'home',
        moduleId: 'viewmodels/home',
        name: 'Home',
        visible: true,
        caption: 'Home'
    }, {
        url: 'login',
        moduleId: 'viewmodels/account/login',
        name: 'Login',
        visible: false,
        caption: 'Login'
    }, {
        url: 'register',
        moduleId: 'viewmodels/account/register',
        name: 'Register',
        visible: false,
        caption: 'Register'
    }, {
        url: 'settings',
        moduleId: 'viewmodels/settings',
        name: 'Settings',
        visible: true,
        caption: 'Settings'
    }, {
        url: 'trips',
        moduleId: 'viewmodels/trips',
        name: 'Trips',
        visible: true,
        caption: 'Trips'
    }, {
        url: 'drivers',
        moduleId: 'viewmodels/drivers',
        name: 'Drivers',
        visible: true,
        caption: 'Drivers'
    }
    //    , {
    //    url: 'sessiondetail/:id',
    //    moduleId: 'viewmodels/sessiondetail',
    //    name: 'Edit Session',
    //    visible: false
    //}, {
    //    url: 'sessionadd',
    //    moduleId: 'viewmodels/sessionadd',
    //    name: 'Add Session',
    //    visible: false,
    //    caption: '<i class="icon-plus"></i> Add Session',
    //    settings: { admin: true }
    //}
    ];

    var startModule = 'login';

    return {
        debugEnabled: ko.observable(true),
        imageSettings: imageSettings,
        remoteServiceName: remoteServiceName,
        routes: routes,
        startModule: startModule
    };
});