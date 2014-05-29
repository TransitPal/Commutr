angular.module('app.controllers', [])

.controller('TrackCtrl', ['$rootScope', '$scope', 'ServerReq', 'CustomPromises', function($rootScope, $scope, ServerReq, CustomPromises) {
  $scope.trackMe = function() {
    CustomPromises.p_geoloc()
    .then(function(location) {
      return ServerReq.postReq($rootScope.localServerURL + '/track', {location: location});
    })
    .then(function(data) {
      console.log('tracking location: ', data);
    });
  };

  $scope.continuousTrack = function(delay) {
    setInterval($scope.trackMe, delay);
  };
}])

.controller('RouteCtrl', ['$rootScope', '$scope', 'ServerReq', 'CustomPromises', '$ionicLoading', function($rootScope, $scope, ServerReq, CustomPromises, $ionicLoading) {
  // $scope.loading = $ionicLoading.show({
  //   content: 'Getting current location...',
  //   showBackdrop: false
  // });

  var directionsRenderer = new google.maps.DirectionsRenderer();

  CustomPromises.p_geoloc()
  .then(function(location) {
    var currentLoc = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

    mapOptions = {
      center: currentLoc,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    directionsRenderer.setMap(map);

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
      e.preventDefault();
      return false;
    });

    ServerReq.testDirections(currentLoc, directionsRenderer);
    // ServerReq.getReq($rootScope.localServerURL + '/routes')
    // .then(function(data) {
      // directionsRenderer.setDirections(data.route);
      // do something with data.time
    // });
  }, function(err) {
    console.log('error: ', err);
  });
}])

.controller('SettingsCtrl', ['$rootScope', '$scope', 'ServerReq', 'Notify', function($rootScope, $scope, ServerReq, Notify) {
  $scope.postSettings = function(user){
    console.log('data sent to server: ', user);
    var obj = window.plugin.notification.local;
    ServerReq.postReq($rootScope.localServerURL + '/user', {user: user})
    .then(function(data) {
      alert('post data to server complete: ', data);
      Notify.notify(new Date().getTime() + 10000, obj);
      console.log('finished');

    });
  };
}]);
