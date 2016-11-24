var User = require('../models/account');
var passport = require('passport');

var register = function(username, password) {
    return new Promise((resolve, reject) => {
        User.register(new User({ username : username }), password, (err, user) => {
            if (err) {
                reject(err)
            } else {
                resolve(user);
            }                                        
        });
    }); 
};

var authenticate = function(req, res) {
    // var passportAuth = passport.authenticate('local');
    return new Promise((resolve, reject) => {        
        passport.authenticate('local')(req, res, () => {
            try {
                resolve(); 
            }
            catch(err) {
                reject(err);
            }
        });
    }).then(() => saveSession(req));    
};

var logout = function(req, res) {
    return new Promise((resolve, reject) => {
        try {
            req.logout();
            resolve();
        }
        catch(err) {
            reject(err);
        }        
    }).then(() => saveSession(req));
};

var saveSession = function(req) {
    return new Promise((resolve, reject) => {
        req.session.save((err) => {
                if (err) {
                    reject(err);                    
                } else {
                    resolve();
                }                
            });
    });
};

module.exports = {
    'register' : register,
    'authenticate' : authenticate,
    'saveSession' : saveSession,
    'logout' : logout
};