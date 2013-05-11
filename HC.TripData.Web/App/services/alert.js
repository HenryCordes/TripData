define(
    function () {

        var dialog = {
            showMessage: showMessage
        };

        return dialog;
        
        function showMessage(message, callback, title, buttonName) {
            title = title || "TripData";
            buttonName = buttonName || 'OK';

            if (navigator.notification && navigator.notification.alert) {

                navigator.notification.alert(
                    message,    // message
                    callback,   // callback
                    title,      // title
                    buttonName  // buttonName
                );

            } else {

                alert(message);
                if (callback)
                    invoke(callback);
            }

        }
});