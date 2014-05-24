exports.placeholder = function(req, res){
  res.send(200, 'Hello, world! ^_^');
};

exports.getRoutes = function(req, res){
  res.send(200, [{route: null}]);
}