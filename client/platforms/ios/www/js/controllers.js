angular.module('app.controllers', [])

.controller('RouteCtrl', function($scope) {
})

.controller('SettingsCtrl', ['$scope', 'ServerReq', function($scope, ServerReq) {
  // ServerReq.postReq('/routes', {user: $scope.user})
  // .then(function(data) {
  //   console.log('post data to server complete: ', data);
  // });
  // console.log('post data to server complete: ', $scope.user);
});
