var express = require('express');
var router = express.Router();

var authorized = require('../middleware/authorized');
var storageService = require('../services/storageService');

var config = require('../config');

/* GET image. */ 
router.get('/:id', authorized(), function(req, res) {
    storageService.get(req.params.id).pipe(res);
});

/* POST image. */
router.post('/', authorized(), function(req, res) {
    storageService.upload(req, req.user.id, config.maxImageSize)
        .then(() => {
            req.flash('info', 'Success!');
            res.redirect('/');
        })
        .catch((err) => {
            req.flash('error', err.message);            
            res.redirect('/');            
        })
});   

module.exports = router;