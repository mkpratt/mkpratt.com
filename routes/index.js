var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET pages. */
router.get('/frontend', function(req, res, next) {
  res.render('frontend.pug', { root: 'views' });
});

router.get('/backend', function(req, res, next) {
  res.render('backend.pug', { root: 'views' });
});

router.get('/me', function(req, res, next) {
  res.render('me.pug', { root: 'views' });
});

router.get('/design', function(req, res, next) {
  res.render('design.pug', { root: 'views' });
});

module.exports = router;