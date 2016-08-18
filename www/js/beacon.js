angular.module('beacon', [])
	.directive('beacons', function() {
		return {
			controller: 'beaconsController',
			restrict: 'E',
			template: '<div class="list"> \
					        <div ng-repeat="(key, value) in beacons"> \
		                <div class="item" ng-repeat="(key2, value2) in value"> \
	                    <div ng-repeat="(key3, value3) in value2"> \
	                      {{key3}} : {{value3}}<br> \
					            </div> \
					          </div> \
					        </div> \
				        </div>',
			replace: true
		};
	})
	.controller('beaconsController', function($scope, $ionicPlatform) {
    $ionicPlatform.ready(function() {
      $scope.beacons = {};
      $scope.$apply();
			var delegate = new cordova.plugins.locationManager.Delegate();

			delegate.didDetermineStateForRegion = function (pluginResult) {
	      var uniqueBeaconKey;
        uniqueBeaconKey = pluginResult.region.uuid + ':' + 
        	pluginResult.region.major + ':' + pluginResult.region.minor;
        $scope.beacons[uniqueBeaconKey] = pluginResult;
	      $scope.$apply();
		    cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
		        + JSON.stringify(pluginResult));
			};

			delegate.didRangeBeaconsInRegion = function (pluginResult) {
	      var uniqueBeaconKey;
        uniqueBeaconKey = pluginResult.region.uuid + ':' + 
        	pluginResult.region.major + ':' + pluginResult.region.minor;
        $scope.beacons[uniqueBeaconKey] = pluginResult.beacons;
	      $scope.$apply();
			};

			var uuid = 'da6a052c-6eb5-4a6f-8699-862e88e45dcb';
			var identifier = 'beacons';
			var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid);

			cordova.plugins.locationManager.setDelegate(delegate);

			// required in iOS 8+
			cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
			// or cordova.plugins.locationManager.requestAlwaysAuthorization()

	    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
		    .fail(function(e) { console.error(e); })
		    .done();
		});
	});