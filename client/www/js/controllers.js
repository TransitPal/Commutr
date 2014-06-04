angular.module('app.controllers', [])

.controller('LoginCtrl', ['$scope', '$state','$q', '$window', '$rootScope', '$http', function($scope, $state, $q, $window, $rootScope, $http) {
  var p_auth = function(authOptions) {
    console.log('in p_auth');
    var deferred = $q.defer();

    var authUrl = 'https://accounts.google.com/o/oauth2/auth?' +
      "client_id=" + authOptions.client_id + "&" +
      "redirect_uri=" + authOptions.redirect_uri + "&" +
      "response_type=code&" + 
      "scope=" + authOptions.scope;

    var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
    console.log('After window.open');
    $(authWindow).on('loadstart', function(event) {
      alert('event: ', event);
      var url = event.originalEvent.url;
      var code = /\#code=(.+)$/.exec(url);
      var error = /\#error=(.+)$/.exec(url);

      if (code || error) {
        alert('code or error');
        authWindow.close();
      }
      if (code) {
        $http.post('https://accounts.google.com/o/oauth2', {code:code, client_id: authOptions.client_id, client_secret: 'secret', redirect_uri: authOptions.redirect_uri, grant_type:"authorization_code"})
        .success(function(data){
            // get access_token
          $rootScope.accessToken = data.access_token;
          $rootScope.refreshToken = data.refresh_token;
          deferred.resolve(data);
        })
        .error(function(error){
          deferred.reject(error);
        })
      } else if (error) {
        deferred.reject(error);
      }
    });

    return deferred.promise;
  };

  $scope.auth = function() {
    console.log('In Auth');
    p_auth({
      client_id: '243623987042-ibvoulim8vu4ftgdmpra8son00jgbrj6.apps.googleusercontent.com',
      client_secret: 'secret',
      redirect_uri: 'http://localhost',
      scope: 'https://www.googleapis.com/auth/plus.login'
    })
    .then(function(data) {
      console.log('Access Token: ', data);
      $http.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + $rootScope.accessToken)
      .success(function(tokenInfo){
        $rootScope.userId = tokenInfo.user_id;
        $state.go('tab.track');
      })
      .error(function(err){
        console.log('Error: ', err);
      })
      // ServerReq.postReq('/auth', {code: data[1]})
      // .then(function(data) {
      //   console.log('sucessful post, server response: ', data);
      //   $state.go('tab.track');
      // })
      // .catch(function(err) {
      //   console.log('error: ', err);
      //   $state.go('tab.track');
      // });
    }, function(err) {
      console.log('error: ', err);
    });
    console.log('end of auth');
  };
}])

.controller('TrackCtrl', ['$rootScope', '$scope', 'ServerReq', 'CustomPromises', function($rootScope, $scope, ServerReq, CustomPromises) {
  $scope.trackMe = function() {
    CustomPromises.p_geoloc()
    .then(function(location) {
      console.log('location: ', location);
      return ServerReq.postReq($rootScope.localServerURL + '/track', {location: location});
    }, function(err) {
      console.log('error: ', err);
    })
    .then(function(data) {
      console.log('tracking location: ', data);
    }, function(err) {
      console.log('error: ', err);
    });
  };

  $scope.continuousTrack = function(delay) {
    setInterval($scope.trackMe, delay);
  };
}])

.controller('RouteCtrl', ['$rootScope', '$scope', 'ServerReq', 'CustomPromises', '$ionicLoading', function($rootScope, $scope, ServerReq, CustomPromises, $ionicLoading) {
  // $scope.loading = $ionicLoading.show({
  //   content: 'Getting current location...',
  //   showBackdrop: false
  // });

  var directionsRenderer = new google.maps.DirectionsRenderer();
  console.log(directionsRenderer);
  CustomPromises.p_geoloc()
  .then(function(location) {
    console.log('Location!!!!!1',location);
    var currentLoc = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
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

    directionsRenderer.setDirections($rootScope.newDirections);
    ServerReq.getReq($rootScope.localServerURL + '/routes?email=nicksemail@gmail.com')
    .then(function(data) {
      // if ($rootScope.newDirections) {
      //   directionsRenderer.setDirections($rootScope.newDirections);
      // } else {
        directionsRenderer.setDirections(data.route);
      // }
      // directionsRenderer.setDirections(data.route);
      // do something with data.time
    })
    .catch(function(err) {
      console.log('error: ', err);
    });

  }, function(err) {
    console.log('error: ', err);
  });
}])

.controller('SettingsCtrl', ['$rootScope', '$scope', 'ServerReq', 'Notify', '$q', function($rootScope, $scope, ServerReq, Notify, $q) {

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

  var obj = window.plugin.notification.local;

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
}]);
