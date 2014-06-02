var maps = require('./mapUtils.js');

var getNextTime = function(time) {
  var now = new Date();
  var testTime = new Date();
  testTime.setHours(time, 0, 0, 0);

  if (now < testTime) {
    return testTime;
  } else {
    var tomorrow = now.getDate() + 1;
    var nextTime = new Date(now.getFullYear(), now.getMonth(), tomorrow, time);
    return nextTime;
  }
};

var getNextServerRequest = function(user, res, resCode) {
  resCode = resCode || 200;

  // get user routine
  var routine = user.routine;

  // get next work time and next home time
  var nextWorkTime = getNextTime(routine.workTime);
  var nextHomeTime = getNextTime(routine.homeTime);
  var now = new Date();

  // determine which route
  var origin, destination;
  var nextRequest;

  if (now < nextHomeTime && now < nextWorkTime) {
    // user is at work, wants to go home
    origin = user.workLocation;
    destination = user.homeLocation;
    // next request will be at home, for work
    nextRequest = nextWorkTime;
  } else {
    // user is at home, wants to go to work
    origin = user.homeLocation;
    destination = user.workLocation;
    // next request will be at work, for home
    nextRequest = nextHomeTime;
  }

  // get route
  maps.getDirections(origin, destination)
  .then(function(route) {

    // calculate transit time in miliseconds
    var transitTime = maps.getTransitTime(route) * 1000;

    // calculate next request time
    console.log(nextRequest);
    nextRequest = nextRequest.getTime();
    nextRequest -= transitTime;
    nextRequest -= 30*60*1000; // 30 min buffer

    res.send(resCode, {time: nextRequest, route: route});
  })
  .catch(function(err) {
    console.error('ERROR:', err);
    res.send(500, err);
  });
};

module.exports = {
  getNextTime: getNextTime,
  getNextServerRequest: getNextServerRequest
};
