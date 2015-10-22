/**
Copyright 2015 Mikael Kindborg, original file: https://github.com/evothings/evothings-examples/blob/master/resources/libs/evothings/tisensortag/tisensortag.js
Copyright 2015 KIT Anton Truong, adapted to the interfaces of the SensorAPI.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

	 **/
tisensor = (function(){

	var ACCELEROMETER_SERVICE = 'f000aa10-0451-4000-b000-000000000000';
	var ACCELEROMETER_DATA = 'f000aa11-0451-4000-b000-000000000000';
	var ACCELEROMETER_CONFIG = 'f000aa12-0451-4000-b000-000000000000';
	var ACCELEROMETER_PERIOD = 'f000aa13-0451-4000-b000-000000000000';
	var ACCELEROMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb';


	var IRTEMPERATURE_SERVICE = 'f000aa00-0451-4000-b000-000000000000'
	var IRTEMPERATURE_DATA = 'f000aa01-0451-4000-b000-000000000000'
	var IRTEMPERATURE_CONFIG = 'f000aa02-0451-4000-b000-000000000000'
	var IRTEMPERATURE_PERIOD = 'f000aa03-0451-4000-b000-000000000000'
	var IRTEMPERATURE_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'


	var HUMIDITY_SERVICE = 'f000aa20-0451-4000-b000-000000000000'
	var HUMIDITY_DATA = 'f000aa21-0451-4000-b000-000000000000'
	var HUMIDITY_CONFIG = 'f000aa22-0451-4000-b000-000000000000'
	var HUMIDITY_PERIOD = 'f000aa23-0451-4000-b000-000000000000'
	var HUMIDITY_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	var MAGNETOMETER_SERVICE = 'f000aa30-0451-4000-b000-000000000000'
	var MAGNETOMETER_DATA = 'f000aa31-0451-4000-b000-000000000000'
	var MAGNETOMETER_CONFIG = 'f000aa32-0451-4000-b000-000000000000'
	var MAGNETOMETER_PERIOD = 'f000aa33-0451-4000-b000-000000000000'
	var MAGNETOMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	var BAROMETER_SERVICE = 'f000aa40-0451-4000-b000-000000000000'
	var BAROMETER_DATA = 'f000aa41-0451-4000-b000-000000000000'
	var BAROMETER_CONFIG = 'f000aa42-0451-4000-b000-000000000000'
	var BAROMETER_CALIBRATION = 'f000aa43-0451-4000-b000-000000000000'
	var BAROMETER_PERIOD = 'f000aa44-0451-4000-b000-000000000000'
	var BAROMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	var GYROSCOPE_SERVICE = 'f000aa50-0451-4000-b000-000000000000'
	var GYROSCOPE_DATA = 'f000aa51-0451-4000-b000-000000000000'
	var GYROSCOPE_CONFIG = 'f000aa52-0451-4000-b000-000000000000'
	var GYROSCOPE_PERIOD = 'f000aa53-0451-4000-b000-000000000000'
	var GYROSCOPE_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	var KEYPRESS_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb'
	var KEYPRESS_DATA = '0000ffe1-0000-1000-8000-00805f9b34fb'
	var KEYPRESS_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	var tisensor = {};

	tisensor.accelerometer = {
		decoder : function(data) {

				var ax = evothings.util.littleEndianToInt8(data, 0) / 16.0;
				var ay = evothings.util.littleEndianToInt8(data, 1) / 16.0;
				var az = evothings.util.littleEndianToInt8(data, 2) / 16.0 * -1.0;

				return {x:ax, y:ay, z:az};
		},
		uuid:  [{
			service : ACCELEROMETER_SERVICE,
			data : ACCELEROMETER_DATA,
			config : ACCELEROMETER_CONFIG,
			test : "bla",
			configValue: 1,
			period : ACCELEROMETER_PERIOD,
			periodValue: 500,
			notification : ACCELEROMETER_NOTIFICATION
		},
		{
			service : ACCELEROMETER_SERVICE,
			data : ACCELEROMETER_DATA,
			config : ACCELEROMETER_CONFIG,
			test: "te",
			configValue: 0,
			period : null,
			periodValue: null,
			notification : null
		}

	]

	}

	tisensor.offAccelerometer = {

			uuid:  {
				service : ACCELEROMETER_SERVICE,
				data : ACCELEROMETER_DATA,
				config : ACCELEROMETER_CONFIG,
				configValue: 0,
				period : null,
				periodValue: null,
				notification : null
			}

	}
	tisensor.onAccelerometer = {

			decoder : function(data) {

					var ax = evothings.util.littleEndianToInt8(data, 0) / 16.0;
					var ay = evothings.util.littleEndianToInt8(data, 1) / 16.0;
					var az = evothings.util.littleEndianToInt8(data, 2) / 16.0 * -1.0;

					return {x:ax, y:ay, z:az};
			},
			uuid:  {
				service : ACCELEROMETER_SERVICE,
				data : ACCELEROMETER_DATA,
				config : ACCELEROMETER_CONFIG,
				configValue: 1,
				period : ACCELEROMETER_PERIOD,
				periodValue: 500,
				notification : ACCELEROMETER_NOTIFICATION
			}


		}

	tisensor.irTemperatureOff = {

			uuid:  {
				service : IRTEMPERATURE_SERVICE,
				data : IRTEMPERATURE_DATA,
				config : IRTEMPERATURE_CONFIG,
				configValue: 0,
				period : null,
				periodValue: null,
				notification : null
			}

	}
	tisensor.irTemperatureOn = {

			decoder : function(data) {
					// Calculate ambient temperature (Celsius).
					var ac = evothings.util.littleEndianToUint16(data, 2) / 128.0;

					// Calculate target temperature (Celsius, based on ambient).
					var Vobj2 = evothings.util.littleEndianToInt16(data, 0) * 0.00000015625;
					var Tdie = ac + 273.15;
					var S0 =  6.4E-14;	// calibration factor
					var a1 =  1.750E-3;
					var a2 = -1.678E-5;
					var b0 = -2.940E-5;
					var b1 = -5.700E-7;
					var b2 =  4.630E-9;
					var c2 = 13.4;
					var Tref = 298.15;
					var S = S0 * (1 + a1 * (Tdie - Tref) + a2 * Math.pow((Tdie - Tref), 2));
					var Vos = b0 + b1 * (Tdie - Tref) + b2 * Math.pow((Tdie - Tref), 2);
					var fObj = (Vobj2 - Vos) + c2 * Math.pow((Vobj2 - Vos), 2);
					var tObj = Math.pow(Math.pow(Tdie, 4 ) + (fObj / S), 0.25);
					var tc = tObj - 273.15;
				return { ambientTemperature: ac, targetTemperature: tc }
				},
			uuid:  {
				service : IRTEMPERATURE_SERVICE,
				data : IRTEMPERATURE_DATA,
				config : IRTEMPERATURE_CONFIG,
				configValue: 1,
				period : IRTEMPERATURE_PERIOD,
				periodValue: 500,
				notification : IRTEMPERATURE_NOTIFICATION
			}


		}

	tisensor.humidityOff = {

			uuid:  {
				service : HUMIDITY_SERVICE,
				data : HUMIDITY_DATA,
				config : HUMIDITY_CONFIG,
				configValue: 0,
				period : null,
				periodValue: null,
				notification : null
			}

	}
	tisensor.humidityOn = {

			decoder : function(data) {

						// Calculate the humidity temperature (Celsius).
						var tc = -46.85 + 175.72 / 65536.0 * evothings.util.littleEndianToInt16(data, 0)

						// Calculate the relative humidity.
						var h = -6.0 + 125.00 / 65536.0 * (evothings.util.littleEndianToInt16(data, 2) & ~0x03)

					return {humidityTemperature:tc, relativeHumidity:h};
			},
			uuid:  {
				service : HUMIDITY_SERVICE,
				data : HUMIDITY_DATA,
				config : HUMIDITY_CONFIG,
				configValue: 1,
				period : HUMIDITY_PERIOD,
				periodValue: 500,
				notification : HUMIDITY_NOTIFICATION
			}


		}

	tisensor.magnetometerOff = {

			uuid:  {
				service : MAGNETOMETER_SERVICE,
				data : MAGNETOMETER_DATA,
				config : MAGNETOMETER_CONFIG,
				configValue: 0,
				period : null,
				periodValue: null,
				notification : null
			}

	}
	tisensor.magnetometerOn = {

			decoder : function(data) {
				// Magnetometer values (Micro Tesla).
				var mx = evothings.util.littleEndianToInt16(data, 0) * (2000.0 / 65536.0) * -1
				var my = evothings.util.littleEndianToInt16(data, 2) * (2000.0 / 65536.0) * -1
				var mz = evothings.util.littleEndianToInt16(data, 4) * (2000.0 / 65536.0)

				// Return result.
				return { x: mx, y: my, z: mz }
			},
			uuid:  {
				service : MAGNETOMETER_SERVICE,
				data : MAGNETOMETER_DATA,
				config : MAGNETOMETER_CONFIG,
				configValue: 1,
				period : MAGNETOMETER_PERIOD,
				periodValue: 500,
				notification : MAGNETOMETER_NOTIFICATION
			}


		}

	tisensor.gyroscopeOff = {

			uuid:  {
				service : GYROSCOPE_SERVICE,
				data : GYROSCOPE_DATA,
				config : GYROSCOPE_CONFIG,
				configValue: 0,
				period : null,
				periodValue: null,
				notification : null
			}

	}
	tisensor.gyroscopeOn = {

			decoder : function(data) {
				// Calculate gyroscope values. NB: x,y,z has a weird order.
				var gy = -evothings.util.littleEndianToInt16(data, 0) * 500.0 / 65536.0
				var gx =  evothings.util.littleEndianToInt16(data, 2) * 500.0 / 65536.0
				var gz =  evothings.util.littleEndianToInt16(data, 4) * 500.0 / 65536.0

				// Return result.
				return { x: gx, y: gy, z: gz }
			},
			uuid:  {
				service : GYROSCOPE_SERVICE,
				data : GYROSCOPE_DATA,
				config : GYROSCOPE_CONFIG,
				configValue: 1,
				period : GYROSCOPE_PERIOD,
				periodValue: 500,
				notification : GYROSCOPE_NOTIFICATION
			}


		}

	tisensor.keypressOff = {

			uuid:  {
				service : KEYPRESS_SERVICE,
				data : KEYPRESS_DATA,
				config : null,
				configValue: 0,
				period : null,
				periodValue: null,
				notification : KEYPRESS_NOTIFICATION
			}

	}
	tisensor.keypressOn = {

			decoder : function(data) {

				// Return result.
				return data[0]
			},
			uuid:  {
				service : KEYPRESS_SERVICE,
				data : KEYPRESS_DATA,
				config :  null,
				configValue: 1,
				period : null,
				periodValue: null,
				notification : KEYPRESS_NOTIFICATION
			}


		}


	return tisensor;
})();
