(function () {
    var device = {
        ID: "BrowserDeviceOrientation",
        sensors: {
            orientation: {
                subscribe: function (handler) {
                    window.addEventListener("deviceorientation", handler, false);
                },
                unsubscribe: function (handler) {
                    window.removeEventListener("deviceorientation", handler, false);
                }
            }
        }
    };

    var onDeviceAdded = function (deviceAddedCallback) {
        deviceAddedCallback(device);
    };

    var onDeviceRemoved = function (deviceRemovedCallback) {
        deviceRemovedCallback(device);
    };

    return {
        onDeviceAdded: onDeviceAdded,
        onDeviceRemoved: onDeviceRemoved
    };
}());
