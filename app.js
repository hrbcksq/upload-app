var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var formValidator = require('./middleware/formValidator');

var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

// routes
var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var image = require('./routes/image');

var config = require('./config.js');
var authConfiguration = require('./config/passport');
mongoose.connect(config.databaseConnection);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'anything',
    resave: false,
    saveUninitialized: false, 
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components/bootstrap',  express.static(__dirname + '/bower_components/bootstrap/dist/'));
app.use('/bower_components/jquery',  express.static(__dirname + '/bower_components/jquery/dist/'));
app.use('/bower_components/freewall',  express.static(__dirname + '/bower_components/freewall/'));

// passport
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

authConfiguration(passport);

// // global messages support
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// setup form validation errors
app.use(formValidator);

// routes
app.use('/', index);
app.use('/register', register);
app.use('/login', login);
app.use('/image', image)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
