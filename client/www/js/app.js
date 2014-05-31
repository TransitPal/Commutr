angular.module('app', ['ionic', 'app.controllers', 'app.services'])

.run(['$rootScope', '$ionicPlatform', function($rootScope, $ionicPlatform) {
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
  $rootScope.localServerURL = 'http://localhost:8080/api/v1';
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

  .state('tab.track', {
    url: '/track',
    views: {
      'tab-track': {
        templateUrl: 'templates/tab-track.html',
        controller: 'TrackCtrl'
      }
    }
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

  $urlRouterProvider.otherwise('/tab/track');
  // $urlRouterProvider.otherwise('/login');
}]);
