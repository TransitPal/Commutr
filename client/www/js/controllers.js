angular.module('app.controllers', [])

.controller('RouteCtrl', ['$scope', 'CustomPromises', 'ServerReq', '$ionicLoading', function($scope, CustomPromises, ServerReq, $ionicLoading) {
  // $scope.loading = $ionicLoading.show({
  //   content: 'Getting current location...',
  //   showBackdrop: false
  // });

  var directionsService = new google.maps.DirectionsService();
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

    var request = {
      origin: currentLoc,
      destination: new google.maps.LatLng(37.7683909618184, -122.51089453697205),
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(response);
      }
    });
  }, function(err) {
    console.log('error: ', err);
  });


  // ServerReq.getReq('/routes')


}])

.controller('SettingsCtrl', ['$rootScope', '$scope', 'ServerReq', 'Notify', function($rootScope, $scope, ServerReq, Notify) {
  $scope.postSettings = function(user){
    console.log('data sent to server: ', user);
    console.log('check: ', $rootScope.serverURL);
    ServerReq.postReq($rootScope.serverURL + '/user', user)
    .then(function(data) {
      Notify.notify(data.time);
      console.log('post data to server complete: ', data);
    });
  };
}]);
