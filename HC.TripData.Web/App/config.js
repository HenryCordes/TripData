define(function () {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var imageSettings = {
        imageBasePath: '../content/images/users/',
        unknownDriverImageSource: 'unknown_person.jpg'
    };

   // var remoteServiceUrl = 'http://tripdata.apphb.com';
  //  var remoteServiceUrl = 'http://10.211.55.3';
    var remoteServiceUrl = '';
    var remoteServiceName = remoteServiceUrl + '/api/tripdata';

    var routes = [{
        url: 'trip',
        moduleId: 'viewmodels/trip',
        name: 'Enter trip',
        visible: true,
        caption: 'Trip'
    }, {
        url: 'account/login',
        moduleId: 'viewmodels/account/login',
        name: 'Login',
        visible: false,
        caption: 'Login'
    }, {
        url: 'account/register',
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
        url: 'sync',
        moduleId: 'viewmodels/sync',
        name: 'Sync',
        visible: true,
        caption: 'Sync'
    }, {
        url: 'trips',
        moduleId: 'viewmodels/trips',
        name: 'Trips',
        visible: true,
        caption: 'Trips'
    }];

    var startModule = 'trip';

    return {
        debugEnabled: ko.observable(true),
        imageSettings: imageSettings,
        remoteServiceName: remoteServiceName,
        remoteServiceUrl:remoteServiceUrl,
        routes: routes,
        startModule: startModule
    };
});