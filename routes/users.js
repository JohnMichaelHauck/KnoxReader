var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  fs.readFile( 'public/history_reformation.txt', 'utf8', function (err, fileText) { res.send(fileText) });
});

module.exports = router;
