var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function (req, res, next) {
  var fileName = __dirname.replace('routes', 'public') + "\\books.html";
  res.render('index', {rawBook: fs.readFileSync(fileName, 'utf8')});
});

module.exports = router;
