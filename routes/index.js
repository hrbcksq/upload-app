var express = require('express');
var router = express.Router();
var formidable = require('formidable');

var authorized = require('../middleware/authorized');
var storageService = require('../services/storageService');

const pageSize = require('../config').pageSize;

/* GET home page. */
router.get('/', authorized('/placeholder'), function(req, res) {
  var page = req.params.page || 0;
  storageService.select(req.user.id, pageSize, pageSize * page)
    .then((images) => {          
      res.render('dashboard', {
        title: 'Dashboard', 
        user: req.user,
        images: images.map(item => item._id.toString()),        
        errors: req.flash('error')     
      });      
  });  
});

/* GET placeholder. */
router.get('/placeholder', function(req, res) {
  res.render('index', { title: 'Index', user: req.user });    
});

module.exports = router;
