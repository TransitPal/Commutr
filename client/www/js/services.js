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
    }
  };
}])

.factory('GeoLocate', ['$q', function($q) {
  return {
    p_geolocate: function() {
      var deferred = $q.defer();
      navigator.geolocation.getCurrentPosition(function(position) {
        deferred.resolve(position);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
  };
}])

.factory('GetGoogleMapDirections', ['$q', function($q) {
  var directionsService = new google.maps.DirectionsService();

  return {
    getDirections: function(directionOptions) {
      var deferred = $q.defer();
      directionsService.route({
        origin: new google.maps.LatLng(directionOptions.origin.lat, directionOptions.origin.lng),
        destination: new google.maps.LatLng(directionOptions.destination.lat, directionOptions.destination.lng),
        travelMode: google.maps.TravelMode.TRANSIT,
        transitOptions: {
          // departureTime: new Date(directionOptions.departureTime),
          arrivalTime: new Date(directionOptions.arrivalTime)
        }
      }, function(directions, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          deferred.resolve(directions);
        } else {
          deferred.reject(status);
        }
      });
      return deferred.promise;
    }
  };
}])

.factory('Notify', [function() {
  return {
    notify: function(time, obj) {
      obj.add({
        date: new Date(time),
        repeat: 'daily',
        message: "You wouldn't want to be late...again.",
        title: "It might be time for you to leave, friend."
      });
    }
  };
}]);
