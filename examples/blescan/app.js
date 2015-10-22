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


document.addEventListener('deviceready', function(){

    sens = new SensorAPI();

    sens.loadDriver('libs/driver/ble.js',{frequency:1500, TTL:5000});
    angular.bootstrap(document, ['tutorialApp']);


}, false);


angular.module('tutorialApp',[])
    .controller('DevicesCtrl', function($scope){
    	$scope.funcCollection = {};
      $scope.devices = [];

         sens.onDeviceAdded(function(device) {
           dev = device;
           for(service in dev.sensors) {
             //Überprüfe ob es eine call funktion für diesen Sensor auf dem Device exisitiert
             //Und überprüfe ob diese Funktioniert nicht bereits exisitiert.


           }
            $scope.devices.push(dev);
            $scope.$apply();
         });

         sens.onDeviceRemoved(function(dev) {
           console.log(dev.name);
         });


    $scope.stopScan = function() {
      sens.stopScan();

    }
    $scope.$apply();
});
