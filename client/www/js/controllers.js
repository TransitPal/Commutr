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

  // renders map with overlays
  GeoLocate.p_geolocate()
  .then(function(location) {
    // sets the client's geolocation
    $scope.clientLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

    // sets the google maps options
    mapOptions = {
      center: $scope.clientLocation,
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // creates the google map
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    $scope.mapReady = true;

    // hides the loading modal
    $scope.loading.hide();

    // sets the google map for the renderer object
    directionsRenderer.setMap($scope.map);

    // renders server sent directions from the settings controller
    if ($rootScope.newDirectionsFromSettings) {
      directionsRenderer.setDirections($rootScope.newDirectionsFromSettings);
      $rootScope.newDirectionsFromSettings = undefined;
    }
  }, function(err) {
    console.log('error: ', err);
  });

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

  // saves geolocations and markers
  $scope.geolocations = [];
  $scope.markers = [];
  $scope.polylines;

  // renders a marker at the client's geolocation
  $scope.setClientMarker = function() {
    if ($scope.mapReady) {
      GeoLocate.p_geolocate()
      .then(function(location) {
        newGeolocation = new google.maps.LatLng(location.coords.latitude + Math.random()*0.8, location.coords.longitude + Math.random()*0.8);
        // newGeolocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
        $scope.geolocations.push(newGeolocation);

        // creates an info window
        var infoWindow = new google.maps.InfoWindow({
          content: "You are running late!"
        });

        // creates a marker
        var marker = new google.maps.Marker({
          position: newGeolocation,
          title: "Client Geolocation",
          icon: "../img/gnome_small.png",
          // animation: google.maps.Animation.DROP,
          animation: google.maps.Animation.BOUNCE,
          draggable: true
        });

        // save the marker;
        $scope.markers.push(marker);

        // removes the existing marker from the map
        if ($scope.clientMarker) {
          $scope.clientMarker.setMap(null);
        }

        // renders the new marker and recenters the map on that marker
        // $scope.map.setCenter(newGeolocation);
        marker.setMap($scope.map);
        $scope.clientMarker = marker;

        // opens the info window when the marker is clicked
        google.maps.event.addListener($scope.clientMarker, 'click', function() {
          infoWindow.open($scope.map, $scope.clientMarker);
          $scope.clientMarker.setAnimation(null);
        });
      });
    }
  };

  // periodically create a new marker
  setInterval($scope.setClientMarker, 1000);

  // renders all markers and polylines
  $scope.showLayers = function(markers, geolocations) {
    // renders all markers
    for (var i = 0; i < markers.length; i++) {
      markers[i].setAnimation(google.maps.Animation.DROP);
      markers[i].setMap($scope.map);
    }

    // renders polylines for all geolocations
    var polylines = new google.maps.Polyline({
      path: geolocations,
      geodesic: true,
      strokeColor: 'blue',
      strokeOpacity: 0.8,
      strokeWeight: 1
    });

    polylines.setMap($scope.map);
    $scope.polylines = polylines;
  };

  // hides all markers and polylines
  $scope.hideLayers = function(markers, polylines) {
    // hides all markers
    for (var i = 0; i < markers.length; i++) {
      markers[i].setAnimation(null);
      markers[i].setMap(null);
    }

    // hides all polylines
    if (polylines) {
      polylines.setMap(null);
    }
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
