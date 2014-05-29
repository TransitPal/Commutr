angular.module('app.notification', [])


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
