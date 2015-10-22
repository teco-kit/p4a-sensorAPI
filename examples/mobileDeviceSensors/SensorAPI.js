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


// The main scanner object
var SensorAPI = (function(driver,options){
    //To be returned scanner object
    var SensorAPI = {};

    //Make SensorAPI variable a DOM variable
    var eventTrigger = document.createElement("object");
    //SensorAPI = document.createElement("object");

    //Holds internal functions
    var internal = {};

    // Registered scanner
    internal.scanners = [];

    // Setting sensor filter, when looking for specific sensors
    internal.filter = [];

    // Storing the driver objects
    SensorAPI.drivers = {};

    // Stores drivers internally
    internal.drivers = [];



    //Storage for the devices
    SensorAPI.devices = {};

    //Storage for all ever detected devices
    SensorAPI.deviceHistory = {};

    //Internal timeout watcher for each device
    internal.timeouts = [];

    //Setze globalen Filter
    if(options && options.filterBySensorTypes) {
    	internal.filter = options.filterBySensorTypes ? options.filterBySensorTypes : "";
    } else {
    	internal.filter = false;
    }

    // events
    internal.events = {
        deviceAdded: "deviceAdded",
        deviceRemoved: "deviceRemoved"
      };

    //Setzte TTL für sensoren
    if(options && options.setTTL) {
    	internal.TTL = options.setTTL ? options.setTTL : 0;
    } else {
    	internal.TTL = 0;
    }

    /* Register function for scanner.
     Params
     scanners array(), expect objects
     fail     callback in case of fail
     */

    internal.register = function(drivers) {
        for(var scan = 0;scan< drivers.length; scan++) {
            //Check before pushing if the scanner object has a startScan function
            if(drivers[scan]) {
                internal.scanners.push({"driver": drivers[scan].driver, "args":drivers[scan].args});
            }
        }
    }

	/*
	General fail function
	*/

	internal.failFunction = function(e) {
		console.log("Failure: " +JSON.stringify(e));
	}


    /*
     Expecting sensors as an object. Each element in the object must represent a sensor. So that one can sort out the sensors according to the
     given flter. internal.filter
     */
     internal.storeDevice = function(device, driver) {
       // Check if the device meets the device interface requirements
       internal.checkMandatoryInterface(device, [
         {name: "ID", type: "string"},
         {name: "description", type: "string", replace:"No description"},
         {name: "sensors", type:"object", replace:null}
       ]);

       // Add the driver information
       device.driver = driver;
     		//Check if the sensors is already in internal.devices
     		if(device.ID != undefined) {

          if(SensorAPI.getFilter().length > 0 && internal.filterBySensorType(device.sensors)) {
  	          // Überprüfe ob der Sensor bereits bekannt ist und im SensorAPI.devices vorhanden ist.
              //console.log(device.ID);
              if(!SensorAPI.devices[device.ID]) {
                  //Speicher welcher treiber verwendet wird
                  SensorAPI.devices[device.ID] = device
                  //Speicher in jemals gefundenen array
                  SensorAPI.deviceHistory[device.ID] = device;
              }
                var event = new CustomEvent(internal.events.deviceAdded, {detail:device},false,false);
                eventTrigger.dispatchEvent(event);
            } else if(!SensorAPI.getFilter() || SensorAPI.getFilter().length == 0) {
              var event = new CustomEvent(internal.events.deviceAdded, {detail:device},false,false);
              eventTrigger.dispatchEvent(event);
            }

        } else {
          console.log("Device is not supported and will be therefore not stored/tracked. Result of getDevices wont contain this device." + device.name);
        }
     	}




     // Callback Function when the interface of the driver is offering an onDeviceRemoved
     internal.removeDevice = function(device) {
       if(SensorAPI.devices[device.ID]) {
         delete SensorAPI.devices[device.ID];
       }
       var event = new CustomEvent(internal.events.deviceRemoved, {detail:device},false,false);
       //SensorAPI.dispatchEvent(event);
       eventTrigger.dispatchEvent(event);
     }



     SensorAPI.onDeviceAdded = function(callback) {
       var stdCallback = function(device) {
         console.log("Device : " + device.name + " (address: " + device.address  +") added.");
       }

       // Schaue ob ein callback übergeben wurde
       // sonst nutze den oben deklarierten Standardcallback
       callback = callback ? callback : stdCallback;
       //SensorAPI.addEventListener(SensorAPI.events.deviceAdded, function(obj) {
       eventTrigger.addEventListener(internal.events.deviceAdded, function(obj) {
         callback(obj.detail);
       });
     }


     SensorAPI.onDeviceRemoved = function(callback) {
       var stdCallback = function(device) {
         console.log("Device : " + device.name + " (address: " + device.address  +") removed.");
       }
       // Schaue ob ein callback übergeben wurde
       // sonst nutze den oben deklarierten Standardcallback
       callback = callback ? callback : stdCallback;

       //SensorAPI.addEventListener(SensorAPI.events.deviceAdded, function(obj) {
       eventTrigger.addEventListener(internal.events.deviceAdded, function(obj) {
         callback(obj.detail);
       });
     }


    //Internal filter function
    //accepts only the string which is to be searched in
    internal.filterBySensorType = function(services) {
        var found = false;
        if(internal.filter && services != null) {
            for (filter in internal.filter) {
              //console.log(internal.filter[filter] + JSON.stringify(services));
              if(JSON.stringify(services).indexOf(internal.filter[filter]) > -1) {
                found = true;
                break;
              }
            }
        }
        if(!internal.filter) {
        	found = true;
        }
        return found;
    }



	/*
		Set filter
	*/
	SensorAPI.setFilter = function(filter) {
		//check if filter has the conform format
		// Must be an array
		var filterSet = false;
		if(filter) {
			internal.filter = filter;
			filterSet = true;
		} else {
			console.log("error: Filter criteria must be in an array");
		}
		return filterSet;
	}

	SensorAPI.getFilter = function() {
		return internal.filter;
	}

  // Driver Exception
  function driverException(message) {
    this.message = message;
    this.name = "Driver Exception.";
  }

  // Checking functions for driver interface
  internal.checkMandatoryInterface = function(loadedDriver, interfaceArray) {
    interfaceArray.forEach(function(element) {
      if(!(loadedDriver[element.name] && typeof loadedDriver[element.name] == element.type)) {
        if(element.replace) {
          loadedDriver[element.name] = element.replace;
        } else {
          throw new driverException("MandantoryInterfaceNotAvailable"+element.name);
        }
      }
    });
  }

  internal.checkOptionalInterface = function(loadedDriver, interfaceArray) {
    interfaceArray.forEach(function(element) {
      if(!(loadedDriver[element] && typeof loadedDriver[element] === "function")) {
        loadedDriver[element] = function(){};
      }
    });
  }


  SensorAPI.loadDriver = function(driver, options) {


    if(!SensorAPI.drivers[driver]) {


      var xhr= new XMLHttpRequest();
      xhr.open('GET', driver, true);
      xhr.onreadystatechange= function() {
          if (this.readyState!==4) return;
          if (this.status!==200) return; // or whatever error handling you want

          var loadedDriver = eval(this.responseText);

          // Check if driver has the mandantory functionsn parameter
          // ID, onDeviceAdded, onDeviceRemoved, Description
          try {
            internal.checkMandatoryInterface(
              loadedDriver,
              [{name:"ID", type:"string", replace: driver},
              {name: "onDeviceAdded", type: "function"},
              {name: "onDeviceRemoved", type: "function"}
            ]);
          } catch(e) {
            console.log(e.message);
          }

          //Check for optional properties, functions
          // initialize, finalize
          internal.checkOptionalInterface(loadedDriver, ["finalize", "initialize"] );

          SensorAPI.drivers[driver] = loadedDriver;
          SensorAPI.drivers[driver].onDeviceAdded(function(dev) {internal.storeDevice(dev,driver);}, options);
          SensorAPI.drivers[driver].initialize();
          SensorAPI.drivers[driver].onDeviceRemoved(function(dev) {internal.removeDevice(dev);});
      };
      xhr.send();
    }
  }

  SensorAPI.unloadDriver = function(driver) {
    if(SensorAPI.drivers[driver]) {
      SensorAPI.drivers[driver].finalize();
      SensorAPI.drivers[driver] = null;
      return true;
    } else {
      console.log("No such driver available to be removed: " + driver);
      return false;
    }
  }



    return SensorAPI;
});
