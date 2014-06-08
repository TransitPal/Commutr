angular.module('app', ['ionic', 'app.controllers', 'app.services'])

.run(['$rootScope', '$ionicPlatform', 'ServerReq', function($rootScope, $ionicPlatform, ServerReq) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  // Customizations
  $rootScope.maxMarkers = 100;
  // $rootScope.localServerURL = 'http://localhost:8080/api/v1';
  $rootScope.localServerURL = 'http://commutr-test.azurewebsites.net/api/v1';
  // $rootScope.userId = "118390871090691148775";

  // Event listeners
  document.addEventListener("deviceready", function() {
    document.addEventListener("resume", function() {
      $state.go('tab.route');
    }, false);

    // Initial geolocation call to trigger permission request
    window.navigator.geolocation.getCurrentPosition(function(location) {
        console.log('Location from Phonegap:', location);
    });

    // Set up background geolocation
    var bgGeo = window.plugins.backgroundGeoLocation;

    var bgGeoCallback = function(location) {
      ServerReq.postReq($rootScope.localServerURL + '/user/' + $rootScope.userId + '/location', 
            { time: new Date().getTime, location: {lat: location.latitude, lng: location.longitude}})
      .then(function() {
        bgGeo.finish();
      });
    };

    var bgGeoFailure = function(err) {
      console.error('ERROR: ', err);
    };

    bgGeo.configure(bgGeoCallback, bgGeoFailure, {
      url: $rootScope.localServerURL + '/user/' + $rootScope.userId + '/location',
      params: {                                              
        time: new Date().getTime(), 
        location: {
          lat: location.latitude, 
          lng: location.longitude
        }
      },
      desiredAccuracy: 10,
      stationaryRadius: 10,
      distanceFilter: 10,
      debug: true
    });

    // turn on background geolocation system
    bgGeo.start();
  }, false);

}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  })

  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tab.route', {
    url: '/route',
    views: {
      'tab-route': {
        templateUrl: 'templates/tab-route.html',
        controller: 'RouteCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })

  // $urlRouterProvider.otherwise('/tab/route');
  $urlRouterProvider.otherwise('/login');
}]);
