SensorAPI.js
============
The API provides an easy and consistent way to handle devices with sensors.


<!-- TOC depth:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installation](#installation)
- [First steps](#first-steps)
- [Drivers](#drivers)
- [Complete Example(s)](#complete-examples)
- [SensorAPI.js Interfaces](#sensorapijs-interfaces)
	- [Overview how to use](#overview-how-to-use)
- [Interfaces](#interfaces)
	- [Driver Interface](#driver-interface)
		- [Device Interface](#device-interface)
			- [Sensor Interface](#sensor-interface)
	- [Guidelines: Writing a driver](#guidelines-writing-a-driver)
		- [Example of a driver](#example-of-a-driver)
		- [Example of a device and sensor](#example-of-a-device-and-sensor)
		- [Complete Example of a driver](#complete-example-of-a-driver)
- [Authors](#authors)



<!-- /TOC -->


#Installation

Include this into the HTML-header:
```javascript
<script src="SensorAPI.js"></script>
```

#First steps

* We will now create our SensorAPI-object and load a driver:
```javascript
// Creating our scan-object
var app = new SensorAPI();

//Now loading a driver to get the sensor of the smartphone where the app is running
app.loadDriver("pathtodriver");

// You can add multiple driver
// e.g. app.loadDriver("driver/webrtc.js");

```


* **New devices found**: To get notified when new devices were found, just pass a callback to 'onDeviceAdded'.
* Everytime a driver finds new devices, the SensorAPI - interface 'onDeviceAdded' will invoke the callback passing the device from the driver.

  ```javascript
  app.onDeviceAdded(function(device) {
      //Your code here.  
			console.log(device.name);
  });
  ```

* **Device not reachable anymore**: To get notified when a device is not available anymore.

  ```javascript
  app.onDeviceRemoved(function(device) {
      //Your code here.  
  });
  ```

#Drivers
```html
Note: For more informaton about drivers, READMEs and the driver can
be found in this project under '/driver' or on other sources/sites.
```


#Complete Example(s)
<a name='fullyExample'></a>

- Displays found devices, when the driver is loaded
- Configured (filter) to look for devices with accelerometer sensor.
- Two buttons:
  - Display accelerometer x value
  - Unloading driver
    - onDeviceRemoved will notifiy that the device is no longer available

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Scanning App</title>
    <script src="SensorAPI.js"></script>
  </head>
  <body>
    Listing of devices:
    <div id='device_list'></div>
    <span>Current X value: <div id='accelerometerValue'></div></span>
    <button onclick='unloadDriver()'>Unloading driver</button>
    Device removed: <div id='deviceRemoved'></div>
    <script>
      //Creating our scanner object
      var app = new SensorAPI();

      //Filter device for accelerometer sensor
      app.setFilter(['accelerometer']);

      //Adding browsers' own device orientation to get access to like the acceleration
      app.loadDriver("driver/deviceMotion1.js");

      //Listening when the device are found
      app.onDeviceAdded(function(device) {
					console.log(device.name);
					displayAccelerometerValue(device);
      });

      // Handler for removed devices
      app.onDeviceRemoved(function(device) {
        $('#deviceRemoved').html(device.name);
      });

      function displayAccelerometerValue(device) {
        device.sensors.accelerometer.subscribe(function(data) {
          $('#accelerometerValue').html(data.x);
        });
      }

      function unloadDriver() {
        app.unloadDriver("driver/deviceMotion1.js");
      }

    </script>

  </body>
</html>

```

#SensorAPI.js Interfaces

|                API        | Description |
|---------------------------|-------------|
|loadDriver(pathToDriver)    |Loading a driver with a path to driver|
|unloadDriver(pathToDriver)    |Removing a driver with a path to driver|
|drivers[pathToDriver]  | Contains all driver objects |
|devices       |Contains an array with all devices which are currently available |
|deviceHistory            |Returns an array containing all devices ever found |
|setFilter(array)           |Filter for devices according to the criteria.|
|getFilter()                |Returns the set filter criteria.|
| onDeviceAdded(callback)  | When device is detected for the first time. |
| onDeviceRemoved(callback) | Will invoke when a device does not signal that is still. Must be supported by the driver.|


## Overview how to use
```javascript
  var app = new SensorAPI();
  // loadDriver(pathToDriver)
  app.loadDriver("driver/webrtc.js");

  // unloadDriver(pathToDriver)
  app.unloadDriver("driver/webrtc.js");

  // drivers(pathToDriver)
  // To get access to driver specific methods e.g. starting scanning of BLE-devices
  app.drivers["driver/easyble.js"].startScan();

  // devices and everFoundDevices
  app.devices[deviceID].name; // --> e.g. "Heart Rate Monitor"

  // setFilter()
  app.setFilter(["infrared", "light"]);

  // getFilter()
  var retrievedFilter = app.getFilter(); //--> output ["infrared", "light"]

  // onDeviceAdded and onDeviceRemoved
  app.onDeviceAdded(callback);
  app.onDeviceRemoved(callback);

```

# Interfaces
This section describes the neccessary interfaces of a driver, device and a sensor.

## Driver Interface

- Mandantory driver interfaces:

| Name       |  Type        | Description |
|------------|--------------|-------------|
| ID         | string       | Unique identifier |
| onDeviceAdded(callback)  | function | The devices will be passed to the callback |
| onDeviceRemoved(callback) | function | To be removed devices will be passed to the callback |

- Optional interfaces:

| Name |  Type | Description |
|------------|--------------|----|
| initialize       | function | Starts driver specific tasks |
| finalize | function | Ends driver specific tasks. Will be invoked when the driver is unloaded |



### Device Interface

- Mandantory device interfaces:

| Name |  Type | Description |
|------------|--------------|----|
| ID       | string | Unique identifier |
| description | string | Device description |
|sensors| object/array | Contains all the sensors the device provides |

#### Sensor Interface
- Recommended sensors interfaces. Each sensor of the device sensors mentioned above should be designed according to this:

| Name |  Type | Description |
|------------|--------------|----|
| name     | string | Name of the sensor|
| subscribe(callback) | function | Sensors values will be passed to the callback. |
|unsubscribe| function| Stops the subscription |

## Guidelines: Writing a driver
- When the driver is loaded (by loadDriver()). It should return an object with these interfaces.

### Example of a driver
```javascript
(function(){
  // Holds the callback when a device is added or removed
  var addDevice;
  var removeDevice;
  driver = {};

  // Mandantory interfaces
  driver.ID = "Identifier";
  driver.onDeviceAdded = function(callbackForAddingDevice) {
    // Stores the callback for later use, when a device is added
    addDevice = callbackForRemovingDevice;
  };
  driver.onDeviceRemoved = function(callbackForRemovingDevice) {
    // Stores the callback for later use, when a device is removed
    removeDevice = callbackForRemovingDevice;
  };

  //Optional interfaces
  driver.initialize = function() {
    // Starts some driver specific tasks. E.g. finding device and passed it to the stored callback 'addDevice'
    addDevice(device);
  };
  driver.finalize = function() {
    // Ends driver specific tasks. E.g. signaling the SensorAPI that the devices are no longer available
    removeDevice(device);
  }

  return driver;
})();
```
### Example of a device and sensor

```javascript
(function(){
  ...

  device = {
    ID : "SensorDevice",
    description: "Desciption of the device",
    sensors : [
      {
        ID: "Identifier",
        name: "humidity",
        subscribe: function(callback) {
                      // Pass the sensor values to the callback
                      callback(3);
                    },
        unsubscribe: function() {
          //Stops subscribing
        }
      }
    ]
  }

  ...
})();
```

### Complete Example of a driver
This is a complete simple driver with virtual devices and sensors.
```javascript
(function(){
  // Holds the callback when a device is added or removed
  var addDevice;
  var removeDevice;
  driver = {};

  // Defining a virtual device
  device = {
    ID : "SensorDevice",
    description: "Desciption of the device",
    sensors : [
      {
        ID: "Identifier",
        name: "humidity",
        subscribe: function(callback) {
                      // Pass the sensor values to the callback
                      callback(3);
                    },
        unsubscribe: function() {
          //Stops subscribing
        }
      }
    ]
  }

  // Mandantory interfaces
  driver.ID = "Identifier";
  driver.onDeviceAdded = function(callbackForAddingDevice) {
    // Stores the callback for later use, when a device is added
    callbackForRemovingDevice(device);
  };
  driver.onDeviceRemoved = function(callbackForRemovingDevice) {
    // Stores the callback for later use, when a device is removed
    callbackForRemovingDevice(device);
  };

  //Optional interfaces
  driver.initialize = function() {
    // Starts some driver specific tasks. E.g. finding device and passed it to the stored callback 'addDevice'
  };
  driver.finalize = function() {
    // Ends driver specific tasks. E.g. signaling the SensorAPI that the devices are no longer available
  }



  return driver;
})();
```



# Authors
-------

* Anton Truong <truong@teco.edu>
