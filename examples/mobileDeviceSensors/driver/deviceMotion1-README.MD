README -  Browser Device Motion Driver for SensorAPI
===========================================

In SensorAPI.js when the onDeviceAdded is invoked and this driver is included. Every new found device will be passed to the SensorAPI.js-Interface 'onDevicAdded'

This driver provides a device with the sensors:
- accelerometer
- accelerometerIncludingGravity
- rotationRate


accelerometer
-----------------------
Allows you to get the acceleration value without gravity.
If a callback is passed, an object will be passed to and be accessed like this:
```javascript
  sensors.accelerometer.subscribe(function(data) {
    console.log("Value x: " + data.x + " value y: " + data.y + " value z: " + data.z);
  });
```


accelerometerIncludingGravity
-----------------------
Allows you to get the acceleration value including gravity.
If a callback is passed, an object will be passed to and be accessed like this:
```javascript
sensors.accelerometerIncludingGravity.subscribe(function(data) {
  console.log("Value x: " + data.x + " value y: " + data.y + " value z: " + data.z);
});
```


rotationRate
-----------------------
When the offer is generated the callback will be invoked and get passed one
parameter which is the offer.
For example:
```javascript
sensors.rotationRate.subscribe(function(data) {
  console.log("Value alpha: " + data.alpha + " value beta: " + data.beta + " value gamma: " + data.gamma);
});
```


Detail explanation:
------------------------------
Follow this link [Rotation Rate](http://www.html5rocks.com/en/tutorials/device/orientation/?redirect_from_locale=de).


Known issues
--------------
The sample rate cannot be controlled.
