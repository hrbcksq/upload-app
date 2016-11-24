module.exports = function(redirect = '/placeholder') {
    return function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect(redirect);
        }
    }; 
 }
    
