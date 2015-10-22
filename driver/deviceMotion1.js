
/*
Copyright 2015 KIT Anton Truong - truong@teco.edu

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

// Object that holds local device data and functions.
browserDeviceMotion = (function()
{
    /** Main object in the EasyBLE API. */
    var browserDeviceMotion = {};
    /** Internal properties and functions. */
    var internal = {};
    var device = {};

    var events = [];

      //Standard internal callback
      internal.stdCallback = function(data) {console.log("Standard-callback DeviceMotion executed: " + data.detail);}

      //Standard internal fail callback
      internal.failCallback = function(e) { console.log("Fail callback DeviceMotion executed: "  + e);}

      // drivers name
      browserDeviceMotion.name = "browserDeviceMotion1";
      //browserDeviceMotion.ID = "browserDeviceMotion";
      // Building all events needed
      browserDeviceMotion.onDeviceRemoved = function(callback) {

      }


      browserDeviceMotion.onDeviceAdded = function(win, options) {


        // Build Services
        device.sensors = {};
        // Name the device
        // Hier für wird der UserAgent genommen.
        if(navigator.userAgent && false) {
          device.name = navigator.userAgent;
        } else {
          device.name = "browserDeviceMotion1";
        }

        device.ID = "browserDeviceMotion1";

        if (window.DeviceMotionEvent) {
          window.addEventListener('devicemotion', deviceMotionHandler, false);
        } else {

        }

        device.sensors = {
          accelerometer : {
            ID : "accelerometer",
            name : "accelerometer",
            subscribe: function(callback) {
              // überprüfe ob für window bereits ein eventListener für acceleration vorhanden ist
              if(!events['acceleration']) {
                // Es exisitiert noch kein eventListener
                if(callback && typeof(callback) == "function") {
                  events['acceleration'] = function(data) {callback(data.detail);};
                } else {
                  console.log("Ihr callback für Accelration ist nicht gültig.");
                  events['acceleration'] = internal.stdCallback;
                }
                window.addEventListener('acceleration', events['acceleration'], false);

              }
            },
            unsubscribe : function(callback) {
              // überprüfe ob für window bereits ein eventListener für acceleration vorhanden ist
              // Es exisitiert noch kein eventListener
              callback = callback ? callback : internal.stdCallback;

              window.removeEventListener('acceleration', events['acceleration'], false);
              events['acceleration'] = false;
              callback();
            }
          },
        rotationRate: {
        ID : "rotationRate",
        name : "rotationRate",
        subscribe: function(callback) {
          // überprüfe ob für window bereits ein eventListener für acceleration vorhanden ist
          if(!events['rotationRate']) {
            // Es exisitiert noch kein eventListener
            if(callback && typeof(callback) == "function") {

              events['rotationRate'] = function(data) {callback(data.detail);};
            } else {
              console.log("Ihr callback für Accelration ist nicht gültig.");
              events['rotationRate'] = internal.stdCallback;
            }
            window.addEventListener('rotationRate', events['rotationRate'], false);

          }
        },
        unsubscribe : function(callback) {
            // überprüfe ob für window bereits ein eventListener für acceleration vorhanden ist
            // Es exisitiert noch kein eventListener
            var callb = function(){console.log("rotationrate listener off");};
            callback = callback ? callback : callb;

            window.removeEventListener('rotationRate', events['rotationRate'], false);
            events['rotationRate'] = false;
            callback();
          }
        },
        accelerometerIncludingGravity : {
          ID : "accelerometerIncludingGravity",
          name : "accelerometerIncludingGravity",
          subscribe: function(callback) {
            // überprüfe ob für window bereits ein eventListener für acceleration vorhanden ist
            if(!events['accelerationIncludingGravity']) {
              // Es exisitiert noch kein eventListener
              if(callback && typeof(callback) == "function") {
                events['accelerationIncludingGravity'] = function(data) {callback(data.detail);};
              } else {
                console.log("Ihr callback für Accelration ist nicht gültig.");
                events['accelerationIncludingGravity'] = internal.stdCallback;
              }
              window.addEventListener('accelerationIncludingGravity', events['accelerationIncludingGravity'], false);

            }
          },
          unsubscribe : function(callback) {
            // überprüfe ob für window bereits ein eventListener für acceleration vorhanden ist
            // Es exisitiert noch kein eventListener
            var callback = function(){console.log("accelerometerIncludingGravity listener off");};
            callback = callback ? callback : callb;

            window.removeEventListener('accelerationIncludingGravity', events['accelerationIncludingGravity'], false);
            events['accelerationIncludingGravity'] = false;
            callback();
        }
      }
      };

      device.description = "This device accesses the local sensors. Currently available sensors are acceleromter (also with gravity included) and rotation rate.";

      win(device);
    }



        function deviceMotionHandler(eventData) {
        var info, xyz = "[X, Y, Z]";
        // Grab the acceleration from the results
        var acceleration = eventData.acceleration;

        if(eventData.acceleration) {
            // Wenn acceleration vorhandne ist aber das device noch nicht diese
            // Funktion hinzugefügt hat, dann tue es.

            var data = {detail: {x:eventData.acceleration.x, y:eventData.acceleration.y, z:eventData.acceleration.z}};
            var event = new CustomEvent('acceleration', data,false,false);
            window.dispatchEvent(event);
        }


        if(eventData.rotationRate) {
            // Wenn acceleration vorhandne ist aber das device noch nicht diese
            // Funktion hinzugefügt hat, dann tue es.
            var data = {detail: {x:eventData.rotationRate.alpha, y:eventData.rotationRate.beta, z:eventData.rotationRate.gamma}};
            var event = new CustomEvent('rotationRate', data,false,false);
            window.dispatchEvent(event);
        }

        if(eventData.accelerationIncludingGravity) {
            // Wenn acceleration vorhandne ist aber das device noch nicht diese
            // Funktion hinzugefügt hat, dann tue es.

            var data = {detail: {x:eventData.accelerationIncludingGravity.x, y:eventData.accelerationIncludingGravity.y, z:eventData.accelerationIncludingGravity.z}};
            var event = new CustomEvent('accelerationIncludingGravity', data,false,false);
            window.dispatchEvent(event);
        }

        }



    return browserDeviceMotion;
})();
