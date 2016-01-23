// set variables for environment
var express = require('express');
var app = express();
var path = require('path');


app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Set server port
var port = 4000
app.listen(port);
console.log('server is running on port:' + port);