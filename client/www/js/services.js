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
