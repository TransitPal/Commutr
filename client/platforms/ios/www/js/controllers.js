angular.module('app.controllers', [])

.controller('RouteCtrl', ['$rootScope', '$scope', '$ionicLoading', '$q', function($rootScope, $scope, $ionicLoading, $q) {
  // $scope.loading = $ionicLoading.show({
  //   content: 'Getting current location...',
  //   showBackdrop: false
  // });

/*  var p_geo = function() {
    var deferred = $q.defer();

    $rootScope.Scope.$apply(function() {
      navigator.geolocation.getCurrentPosition(function(position) {
        deferred.resolve(position);
      },
      function(err) {
        deferred.reject(err);
      });
    });
      
    return deferred.promise;
  };

  p_geo()
  .then(function(position) {
    $scope.mapOptions = {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  });*/

  //navigator.geolocation.getCurrentPosition(function(position) {
    mapOptions = {
      // center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      center: new google.maps.LatLng(37.7749300, -122.4194200),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
      e.preventDefault();
      return false;
    });

    $scope.map = map;
  // });
}])

.controller('SettingsCtrl', ['$scope', 'ServerReq', function($scope, ServerReq) {
  $scope.postSettings = function(user){
    user.name = 'nick wei';
    user.email = 'nickwei@gmail.com';
    console.log('data sent to server: ', user);
    ServerReq.postReq('127.0.0.1:8080/api/v1/user', user)
    .then(function(data) {
      console.log('post data to server complete: ', data);
    });
  };
}]);
