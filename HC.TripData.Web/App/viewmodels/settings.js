define(['services/logger'], function (logger) {
    var vm = {
        activate: activate,
        title: 'Settings',
        getSettings: _getSettings,
        save: _save,
        settings: ko.observable()
    };

    return vm;


    //#region Internal Methods
    function activate() {

        _getSettings("henry@henrycordes.nl");
        
        logger.log('Settings Activated', null, 'settings', true);
        return true;
    }

    function _getSettings(id) {
        var data = { 'id': id };

        $.ajax({
            type: 'GET',
            url: 'driver/',
            contentType: 'application/json',
            dataType: 'json',
            data: data,
            traditional: true,
            success: function (result) {
                vm.settings = ko.observable(result);
  
            },
            error: function (xmlHttpRequest) {

                alert(xmlHttpRequest.responseText);
            }
        });
    }

    function _save() {
        alert('save');
    };

    //#endregion
});