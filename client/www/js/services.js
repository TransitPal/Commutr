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

    testDirections: function(currentLoc, renderer) {
      var directionsService = new google.maps.DirectionsService();
      var request = {
        origin: currentLoc,
        destination: new google.maps.LatLng(37.7683909618184, -122.51089453697205),
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(directions, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          renderer.setDirections(directions);
        }
      });
    }
  };
}])

.factory('CustomPromises', ['$q', function($q) {
  return {
    p_geoloc: function() {
      var deferred = $q.defer();
      // navigator.geolocation.getCurrentPosition(function(position) {
      //   deferred.resolve(position);
      // },
      // function(err) {
      //   deferred.reject(err);
      // });
      deferred.resolve({coords:{latitude:37.7683909618184, longitude:-122.51089453697205}});
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
