'use strict';

//
// Require all dependencies.
//
var authorize = require('./authorize')
  , bodyParser = require('body-parser')
  , express = require('express')
  , http = require('http')
  , Primus = require('primus')
  , routes = require('./routes');

//
// Create an Express application.
//
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// app.post('/login', routes.login);

//
// Create an HTTP server and our Primus server.
//
var server = http.createServer(app)
  , primus = new Primus(server);

primus.save(__dirname +'/primus.js');
//
// Add the authorization hook.
//
primus.authorize(authorize);

//
// `connection` is only triggered if the authorization succeeded.
//
primus.on('connection', function connection(spark) {
  console.log('1.connection : SUCCESS');
  const SUCCESS = {'type': 'authenticated', 'payload': 'success'}
  spark.write(SUCCESS);
});

//
// Begin accepting connections.
//
server.listen(9000, function listening() {
  console.log('Open http://localhost:9000 in your browser');
});
