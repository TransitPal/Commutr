var app = require('./server/app');
var port = app.get('port');
var log = 'Listening on ' + app.get('base url') + ':' + port;

app.listen(port);
console.log(log);