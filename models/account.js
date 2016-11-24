var passportLocalMongoose = require('passport-local-mongoose');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var accountSchema =  new Schema({
    username: {type: String},
    password: {type: String}
});

// todo separate from model
accountSchema.plugin(passportLocalMongoose);    

module.exports = mongoose.model('Account', accountSchema);
    

