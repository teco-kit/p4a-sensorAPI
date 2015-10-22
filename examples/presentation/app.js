/*
Copyright [2015] [Anton Truong - truong@teco.edu]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


// Creating our scan-object
var app = new SensorAPI();

//Now loading a driver to get the sensor of the smartphone where the app is running
//Filter device for accelerometer sensor
app.setFilter(['accelerometerIncludingGravity']);

//Adding browsers' own device orientation to get access to like the acceleration
app.loadDriver("driver/deviceMotion2.js");

//Listening when the device are found
app.onDeviceAdded(function(device) {
              console.log(device.name);
              displayAccelerometerValue(device);
});

// Handler for removed devices
app.onDeviceRemoved(function(device) {
    console.log("Device Removed");
});

function displayAccelerometerValue(device) {
  device.sensors.accelerometerIncludingGravity.subscribe(function(data) {
    if(data.y>30) {
      controlMedia("medianext")
    }
    if(data.y<-30) {
      controlMedia("mediaprevious")
    }
  });
}

function unloadDriver() {
  app.unloadDriver("driver/deviceMotion2.js");
}

function controlMedia(mediaControl) {
  console.log(mediaControl);
  var event = new CustomEvent(mediaControl);
  window.dispatchEvent(event);
}
