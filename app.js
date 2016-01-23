// set variables for environment
var express = require('express');
var app = express();
var path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// static content
app.use(express.static(path.join(__dirname, 'public')));

// Route files import
var routes = require('./routes/index');

// Mapping route
app.use('/', routes);

// Set server port
var port = 4000
app.listen(port);
console.log('server is running on port:' + port);
