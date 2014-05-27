angular.module('app.services', [])

.factory('ServerReq', ['$http', function($http) {
  return {
    getReq: function(route) {
      return $http.get(route, {
        cache: true
      })
      .success(function(data) {
        return data;
      });
    },

    postReq: function(route, data) {
      return $http.post(route, data)
      .success(function(serverData) {
        return serverData;
      });
    },

    testDirections: function(currentLoc, callback) {
      var directionsService = new google.maps.DirectionsService();
      var request = {
        origin: currentLoc,
        destination: new google.maps.LatLng(37.7683909618184, -122.51089453697205),
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          console.log('here');
          console.log(response);
          callback(response);
          console.log('there');
        }
      });
    }
  };
}])

.factory('CustomPromises', ['$q', function($q) {
  return {
    p_geoloc: function() {
      var deferred = $q.defer();
      navigator.geolocation.getCurrentPosition(function(position) {
        deferred.resolve(position);
      },
      function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
  };
}]);
