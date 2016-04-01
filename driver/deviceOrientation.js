(function () {
    var onDeviceAdded = function (deviceAddedCallback, options) {
        var device = {
            ID: "browserDeviceOrientation",
            sensors: {
                orientation: {
                    subscribe: function (handler) {
                        window.addEventListener("deviceorientation", handler, false);
                    }
                }
            }
        };
        deviceAddedCallback(device);
    };

    var onDeviceRemoved = function () {
        // TODO
    };

    return {
        onDeviceAdded: onDeviceAdded,
        onDeviceRemoved: onDeviceRemoved
    };
}());
