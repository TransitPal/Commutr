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

module.exports = {
  getNextTime: getNextTime
};
