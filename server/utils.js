var maps = require('./mapUtils.js');

var getNextTime = function(timeObj) {
  hour = (timeObj.hour + 7) % 24;
  minutes = timeObj.minutes;
  var now = new Date();
  var testTime = new Date();
  testTime.setHours(hour, minutes, 0, 0);

  if (now < testTime) {
    return testTime;
  } else {
    var tomorrow = now.getDate() + 1;
    var nextTime = new Date(now.getFullYear(), now.getMonth(), tomorrow, hour, minutes);
    return nextTime;
  }
};

var getNextRoute = function(user) {
  // get user routine
  var routine = user.routine;

  // get next work time and next home time
  var nextWorkTime = getNextTime(routine.workTime);
  var nextHomeTime = getNextTime(routine.homeTime);
  var now = new Date();

  // determine which route
  var origin, destination;
  var arrivalTime;

  if (now < nextHomeTime && now.getDate() < nextWorkTime.getDate()) {
    // user is at work, wants to go home
    origin = user.workLocation;
    destination = user.homeLocation;
    arrivalTime = nextHomeTime.getTime();
  } else {
    // user is at home, wants to go to work
    origin = user.homeLocation;
    destination = user.workLocation;
    arrivalTime = nextWorkTime.getTime();
  }

  return { origin: origin, destination: destination, arrivalTime: arrivalTime };
};

var convertTimeStringToObject = function(timestr) {
  var time = timestr.split(':');
  return {hour: time[0], minutes: time[1]};
};

module.exports = {
  getNextTime: getNextTime,
  getNextRoute: getNextRoute,
  convertTimeStringToObject: convertTimeStringToObject
};
