angular.module('app.controllers', [])

.controller('RouteCtrl', ['$scope', 'CustomPromises', 'ServerReq', '$ionicLoading', function($scope, CustomPromises, ServerReq, $ionicLoading) {
  // $scope.loading = $ionicLoading.show({
  //   content: 'Getting current location...',
  //   showBackdrop: false
  // });

  var directionsRenderer = new google.maps.DirectionsRenderer();

  CustomPromises.p_geoloc()
  .then(function(position) {
    var currentLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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

    // ServerReq.getReq($rootScope.serverURL + '/routes')
    // .then(function(data) {
      ServerReq.testDirections(currentLoc, directionsRenderer.setDirections);
      // do something with data.time
    // });
  }, function(err) {
    console.log('error: ', err);
  });
}])

.controller('SettingsCtrl', ['$rootScope', '$scope', 'ServerReq', function($rootScope, $scope, ServerReq) {
  $scope.postSettings = function(user){
    user.name = 'nick wei';
    user.email = 'nickwei@gmail.com';
    console.log('data sent to server: ', user);
    ServerReq.postReq($rootScope.serverURL + '/user', user)
    .then(function(data) {
      console.log('post data to server complete: ', data);
    });
  };
}]);
