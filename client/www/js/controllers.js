angular.module('app.controllers', [])

.controller('LoginCtrl', ['$rootScope', '$scope', '$state', '$q', '$http', function($rootScope, $scope, $state, $q, $http) {
  var p_auth = function(authOptions) {
    var deferred = $q.defer();

    var authUrl = 'https://accounts.google.com/o/oauth2/auth?' +
      "client_id=" + authOptions.client_id + "&" +
      "redirect_uri=" + authOptions.redirect_uri + "&" +
      "response_type=token&" + 
      "scope=" + authOptions.scope;

    var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

    $(authWindow).on('loadstart', function(event) {
      var url = event.originalEvent.url;

      if (url.indexOf("access_token=") !== -1) {
        var token = url.slice(31,url.indexOf("&token_type="));
      }
      if (url.indexOf("?error=") !== -1) {
        var error = /\?error=(.+)$/.exec(url);
      }

      if (token || error) {
        authWindow.close();
      }

      if (token) {
        deferred.resolve(token);
      } else if (error) {
        deferred.reject(error);
      }
    });

    return deferred.promise;
  };

  $scope.auth = function() {
    var authOptions = {
      client_id: '243623987042-20jcc57di4ol4u36jr3cvidv66h0h6mi.apps.googleusercontent.com',
      client_secret: 'topsecret!',
      redirect_uri: 'http://localhost',
      scope: 'https://www.googleapis.com/auth/plus.login'
    };

    p_auth(authOptions)
    .then(function(token) {
      $rootScope.accessToken = token;
      return $http.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + $rootScope.accessToken)
      .success(function(tokenInfo){
        return tokenInfo;
      });
    })
    .then(function(tokenInfo) {
      $rootScope.userId = tokenInfo.data.user_id;
      $state.go('tab.settings');
    })
    .catch(function(err) {
      console.log('error: ', err);
    });
  };
}])

.controller('RouteCtrl', ['$rootScope', '$scope', 'ServerReq', 'GeoLocate', 'GetGoogleMapDirections', '$ionicLoading', function($rootScope, $scope, ServerReq, GeoLocate, GetGoogleMapDirections, $ionicLoading) {
  // loading screen
  $scope.loading = $ionicLoading.show({
    content: 'Loading...',
    showBackdrop: false
  });

  // instantiates the renderer object for google map directions
  var directionsRenderer = new google.maps.DirectionsRenderer();

  // gets the current geolocation
  // GeoLocate.p_geolocate()
  // .then(function(location) {
    // sets the google maps options
    mapOptions = {
      center: new google.maps.LatLng(37.7749300, -122.4194200),
      // center: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // creates the google map
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    $scope.loading.hide();

    // passes the google map to the renderer object
    directionsRenderer.setMap(map);

    // if the server sent the client directions from the settings controller, render them
    if ($rootScope.newDirectionsFromSettings) {
      directionsRenderer.setDirections($rootScope.newDirectionsFromSettings);
      $rootScope.newDirectionsFromSettings = undefined;
    }
  // }, function(err) {
  //   console.log('error: ', err);
  // });

  // make a request to the server for direction options
  $scope.getDirectionOptions = function() {
    ServerReq.getReq($rootScope.localServerURL + '/routes?email=' + $rootScope.userId)
    .then(function(serverData) {
      return GetGoogleMapDirections.getDirections(serverData.data);
    })
    .then(function(directionsData) {
      directionsRenderer.setDirections(directionsData);
    })
    .catch(function(err) {
      console.log('error: ', err);
    });
  };
}])

.controller('SettingsCtrl', ['$rootScope', '$scope', 'ServerReq', 'GetGoogleMapDirections', 'Notify', '$q', '$http', function($rootScope, $scope, ServerReq, GetGoogleMapDirections, Notify, $q, $http) {

  // posts user identifier and settings to server
  $scope.postSettings = function(user) {
    user.email = $rootScope.userId;
    console.log('user: ', user);
    ServerReq.postReq($rootScope.localServerURL + '/user', {user: user})
    .then(function(serverData) {
      // get the google map directions from the google directions API
      return GetGoogleMapDirections.getDirections(serverData.data);
    })
    .then(function(directionsData) {
      // store the directions on the rootScope for access in the routes controller
      $rootScope.newDirectionsFromSettings = directionsData;
    })
    .catch(function(err) {
      console.log('error: ', err);
    });
  };

/*
  var p_timeout = function(time) {
    var diffTime = Number(time) - Number(new Date());
    var deferred = $q.defer();

    setTimeout(function() {
      ServerReq.getReq($rootScope.localServerURL + '/route')
      .then(function(data) {
        deferred.resolve(data);
      })
      .catch(function(err) {
        deferred.reject(err);
      });
    }, diffTime);

    return deferred.promise;
  };

  // test functioncality code
  var directionsService = new google.maps.DirectionsService();
  var request = {
    origin: new google.maps.LatLng(37.4683909618184, -122.21089453697205),
    destination: new google.maps.LatLng(37.7683909618184, -122.51089453697205),
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(directions, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      $rootScope.newDirections = directions;
      console.log($rootScope.newDirections);
    }
  });

  // var obj = window.plugin.notification.local;

  $scope.postSettings = function(user){
    // var obj = window.plugin.notification.local;
    // console.log('data sent to server: ', user);
    user.email = 'nicksemail@gmail.com';
    ServerReq.postReq($rootScope.localServerURL + '/user', {user: user})
    .then(function(data) {
      // use settimeout to invoke another get request to routes at the time returned by the server
      Notify.notify(new Date().getTime() + 10000, obj);
      return p_timeout(data.time);
    })
    .then(function(data) {
      // parse out duration from the google maps directions object
        // notify the user 10 minutes before he/she needs to leave
      // render the directions object on the map
      console.log('hello, world');
      $rootScope.newDirections = data.route;
    })
    .catch(function(err) {
      console.log('error: ', err);
    });
  };
*/
}]);
