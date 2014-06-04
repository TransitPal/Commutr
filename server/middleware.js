module.exports = {
  logError: function(err, req, res, next) {
    if(err) {
      console.error(err);
      return next(err);
    }
    next();
  },

  handleError: function(err, req, res, next) {
    if(err) {
      res.send(err,500);
    }
  },

  cors: function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Header', 'X-Requested-With, Content-type, Authorization');
    // res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept');

    if(req.method === 'Options') {
      res.send(200);
    } else {
      return next();
    }
  }
};
