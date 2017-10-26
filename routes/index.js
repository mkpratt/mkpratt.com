var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET test pages. */
router.get('/test1', function(req, res, next) {
  res.render('test1.pug', { root: 'views' });
});

router.get('/test2', function(req, res, next) {
  res.render('test2.pug', { root: 'views' });
});

router.get('/test3', function(req, res, next) {
  res.render('test3.pug', { root: 'views' });
});

router.get('/test4', function(req, res, next) {
  res.render('test4.pug', { root: 'views' });
});

module.exports = router;