// locationPoint = {
//   location: {
//     lat: Number,
//     lng: Number
//   },
//   time: Date Object
// };

// data = [locationPoint1, locationPoint2, ..., locationPointN];

// var data = [];
// var coords = kml.kml.Document.Placemark['gx:Track']['gx:coord'];
// for(var i = 0; i < coords.length; i++){
//    var split = coords[i].split(' ');
//    data.push({location: {lat: split[0], lng: split[1]}, time: kml.kml.Document.Placemark['gx:Track'].when[i]})
// }
// 

var filterByTime = function(collection, start, end){
  var filteredCollection = [];
  if(end < start){
    end -= 24;
  }
  for(var i = 0; i < collection.length; i++){
    var hour = new Date(collection[i].time).getHours();
    if(hour > 12 && end < 0){
      hour -= 24;
    }
    if((start <= hour) && (hour <= end)){
      filteredCollection.push(collection[i]);
    }
  }
  return filteredCollection;
};

var toRadians = function(thing){
  return thing * Math.PI / 180;
}

var calculateDistance = function(point1, point2){
  var R = 6371000;
  var dx = toRadians(point2.lat - point1.lat);
  var dy = toRadians(point2.lng - point1.lng);
  var median = Math.pow(Math.sin(dx / 2), 2) + 
                 Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
                 Math.pow(Math.sin(dy / 2),2);
  var c = 2 * Math.atan2(Math.sqrt(median), Math.sqrt(1 - median));

  var distance = R * c;
  return distance;
};

var countClosestPoints = function(point, collection, radius){
  var count = 0;
  for(var i = 0; i < collection.length; i++){
    if(calculateDistance(point.location,collection[i].location) <= radius) count++;
  }
  return count;
};

var findCenter = function(collection, radius, start, end){
  var filteredLocations = filterByTime(collection, start, end);
  var highCount = 0;
  var centerLocations = [];

  for (var i = 0; i < filteredLocations.length; i++) {
    var currentCount = countClosestPoints(filteredLocations[i], filteredLocations, radius);
    if (currentCount > highCount){
      highCount = currentCount;
      centerLocations = [filteredLocations[i]];
    }else if(currentCount === highCount){
      centerLocations.push(filteredLocations[i]);
    }
  };
  if (centerLocations.length === 1){
    return filteredLocations[centerLocations[0]].location;
  }else{
    return averageLocation(centerLocations);
  }
};

var averageLocation = function (locations){
  var latSum = 0;
  var lngSum = 0;
  for(var i = 0; i < locations.length; i++){
    latSum += locations[i].lat;
    lngSum += locations[i].lng;
  }
  var centralLoc = {
    lat: latSum/locations.length,
    lng: lngSum/locations.length
  };

  return centralLoc;
};

var findGnome = function (userId){
  db.getUser(userId)
  .then(function(user){
    user.homeLocation = findCenter(user.locations, 1, 23, 4);
    user.save().exec()
    .then(function(user){
      console.log('User: ', user);
    }, function(err){
      console.error(err);
    });
  })
};

var findWork = function (userId){
  db.getUser(userId)
  .then(function(user){
    user.workLocation = findCenter(user.locations, 1, 10, 16);
    user.save().exec()
    .then(function(user){
      console.log('User: ', user);
    }, function(err){
      console.error(err);
    });
  })
};

