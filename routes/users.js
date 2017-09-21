var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fileName = __dirname.replace('routes','public') + "\\history_reformation.txt";
  fs.readFile( fileName, 'utf8', function (err, fileText) { res.send(fileText) });
});

module.exports = router;
