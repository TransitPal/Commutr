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
  $scope.geolocations = [];
  $scope.markers = [];
  $scope.polylines;
  $scope.hideLayers = true;
  $scope.hideLayersButtonText = "Show Locations";
  $scope.hideWeather = true;
  $scope.hideWeatherButtonText = "Show Weather";

  // instantiates the renderer object for google map directions
  var directionsRenderer = new google.maps.DirectionsRenderer();

  // creates loading modal screen
  $ionicLoading.show({
    content: 'Loading...',
    showBackdrop: false
  });

  // renders map with overlays
  GeoLocate.p_geolocate()
  .then(function(location) {
    // sets the client's geolocation
    $scope.clientLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

    // sets the google maps options
    mapOptions = {
      center: $scope.clientLocation,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // creates the google map
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    $scope.mapReady = true;

    // sets the google map for the renderer object
    directionsRenderer.setMap($scope.map);

    // renders server sent directions from the settings controller
    if ($rootScope.directionOptionsFromSettings) {
      directionsRenderer.setDirections($rootScope.directionOptionsFromSettings);
      $rootScope.directionOptionsFromSettings = undefined;
    }

    // hides the loading modal
    $ionicLoading.hide();
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

  // renders a marker at the client's geolocation
  $scope.setClientMarker = function() {
    if ($scope.mapReady) {
      GeoLocate.p_geolocate()
      .then(function(location) {
        // newGeolocation = new google.maps.LatLng(location.coords.latitude + Math.random()*0.8, location.coords.longitude + Math.random()*0.8);
        newGeolocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
        $scope.geolocations.push(newGeolocation);

        // creates an info window
        var infoWindow = new google.maps.InfoWindow({
          content: "You are running late!"
        });

        // creates a marker
        var marker = new google.maps.Marker({
          position: newGeolocation,
          title: "Client Geolocation",
          icon: "./img/gnome.png",
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
  setInterval($scope.setClientMarker, 2000);

  // renders or hides all markers and polylines
  $scope.showOrHideLayers = function() {
    if ($scope.hideLayers) {
      // renders all markers
      for (var i = 0; i < $scope.markers.length; i++) {
        $scope.markers[i].setAnimation(google.maps.Animation.DROP);
        $scope.markers[i].setMap($scope.map);
      }

      // renders polylines for all geolocations
      $scope.polylines = new google.maps.Polyline({
        path: $scope.geolocations,
        geodesic: true,
        strokeColor: 'blue',
        strokeOpacity: 0.8,
        strokeWeight: 1
      });

      $scope.polylines.setMap($scope.map);

      $scope.hideLayers = !$scope.hideLayers;
      $scope.hideLayersButtonText = "Hide Locations";
    } else {
      // hides all markers
      for (var i = 0; i < $scope.markers.length; i++) {
        $scope.markers[i].setAnimation(null);
        $scope.markers[i].setMap(null);
      }

      // hides all polylines
      if ($scope.polylines) {
        $scope.polylines.setMap(null);
      }
      $scope.hideLayers = !$scope.hideLayers;
      $scope.hideLayersButtonText = "Show Locations";
    }
  };

  // renders the cloud and weather layers
  $scope.showOrHideWeather = function() {
    if ($scope.hideWeather) {
      // renders cloud layer
      $scope.cloudLayer = new google.maps.weather.CloudLayer();

      $scope.cloudLayer.setMap($scope.map);

      // renders weather layer
      $scope.weatherLayer = new google.maps.weather.WeatherLayer({
        clickable: true,
        labelColor: "black",
        suppressInfoWindows: false,
        temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT,
        windSpeedUnits: google.maps.weather.TemperatureUnit.MILES_PER_HOUR
      });

      $scope.weatherLayer.setMap($scope.map);

      // adds click event listener to weather layer
      google.maps.event.addListener($scope.weatherLayer, 'click', function(event) {
        alert('The current temperature at ' + event.featureDetails.location + ' is '
          + event.featureDetails.current.temperature + ' degrees.');
      });

      $scope.hideWeather = !$scope.hideWeather;
      $scope.hideWeatherButtonText = "Hide Weather";
    } else {
      // hides cloud and weather layers
      $scope.cloudLayer.setMap(null);
      $scope.weatherLayer.setMap(null);

      $scope.hideWeather = !$scope.hideWeather;
      $scope.hideWeatherButtonText = "Show Weather";
    }
  };
}])

.controller('SettingsCtrl', ['$rootScope', '$scope', '$state', 'ServerReq', 'GetGoogleMapDirections', 'Notify', '$q', function($rootScope, $scope, $state, ServerReq, GetGoogleMapDirections, Notify, $q) {
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
      $rootScope.directionOptionsFromSettings = directionsData;
      $state.go('tab.route');
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

  window.plugin.notification.local.add({
    date: new Date(new Date().getTime() + 10000),
    repeat: 'daily',
    message: "You wouldn't want to be late...again.",
    title: "It might be time for you to leave, friend."
  });
*/
}]);
