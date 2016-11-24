var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticate');
var authorized = require('../middleware/authorized');
var authService = require('../services/authService');

// login region
router.get('/', function(req, res) {
    res.render('partial/login', { title: 'Please log in', error : req.flash('error') });
});

router.post('/', authenticate, function(req, res, next){
    authService.saveSession(req)
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => next(err));      
});

// logout region
router.get('/logout', authorized(), function(req, res) {
    authService.logout(req, res)                
        .then(() => {
            // req.flash('success', 'You are now logged out!');
            res.redirect('/');
        })        
        .catch((err) => next(err));   
});

module.exports = router; 