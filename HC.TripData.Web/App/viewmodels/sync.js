define(['services/logger', 'services/datacontext'], function (logger, datacontext) {

    var numberOfTrips = ko.observable(0), 
        activate = function() {
        logger.log('Home Activated', null, 'home', true);
        document.getElementById('header-title').innerText = 'Sync trips';
        $('ul#navigation > li').removeClass('active');
        $('ul#navigation > li[data-nav="sync"]').addClass('active');
        return true;
        },
        sync = function() {
            datacontext.saveChanges(); 
        };
 
    
    var vm = {
        activate: activate,
        title: 'Sync',
        numberOfTrips: numberOfTrips,
        sync: sync
    };

    return vm;
});