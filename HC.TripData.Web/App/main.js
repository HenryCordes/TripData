require.config({
    paths: { "text": "durandal/amd/text" }
});

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'durandal/plugins/router', 'services/logger'],
    function (app, viewLocator, system, router, logger) {

    // Enable debug message to show in the console 
    system.debug(true);

    app.title = 'Trip Data';

    app.start().then(function () {
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.options.backgroundpositionClass = 'toast-bottom-right';

        router.handleInvalidRoute = function (route, params) {
            logger.logError('No Route Found', route, 'main', true);
        };

        // When finding a viewmodel module, replace the viewmodel string 
        // with view to find it partner view.
        router.useConvention();
        viewLocator.useConvention();
        
        // Adapt to touch devices
        app.adaptToDevice();
        //Show the app by setting the root view model for our application.
        app.setRoot('viewmodels/shell', 'entrance');
    });
        
    app.on('navigation:change').then(function (navigationId) {
        $('ul#navigation > li').removeClass('active');
        $('ul#navigation > li[data-nav="' + navigationId + '"]').addClass('active');
    });
        
 });


ko.bindingHandlers.dateString = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(),
        allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        var pattern = allBindings.datePattern || 'YYYY-MM-DD';
        $(element).val(moment(valueUnwrapped).format(pattern));
    }
}