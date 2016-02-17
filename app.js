// set variables for environment
var express = require('express');
var app = express();
var path = require('path');
app.set('env', "development");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// // jade
// app.set('view engine', 'jade');
//express-handlebars
var exphbs  = require('express-handlebars');

//Declaring Express to use Handlerbars template engine with main.handlebars as
//the default layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// static content
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Route files import
var routeindex = require('./routes/index');

// Mapping route
app.use('/', routeindex);

// CRON
var cronArome = require('./cron/cronArome');
cronArome.start();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('errors/' + err.status, {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('errors/' + err.status, {
    message: err.message,
    error: {}
  });
});



// Set server port
var port = 4000
app.listen(port);
console.log('[App mode]:'+ app.get('env'));
console.log('[Server port]:' + port);
console.log('[Status]:running');
