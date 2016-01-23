// set variables for environment
var express = require('express');
var router = express.Router();
// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

router.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

module.exports = router;