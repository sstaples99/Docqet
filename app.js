module.exports = function(db, passport) {
    //  Load Modules
    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var flash = require('connect-flash');

    //  Initialize App
    var app = express();

    //  Configuring Passport
    var User = require('./schemas/user.js');
    var expressSession = require('express-session');
    app.use(expressSession({secret:'mySecretKey'}));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //  Set-Up View Engine
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    //  App Configuring
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(flash());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    //  Set Router File-paths
    var routes = require('./routes/index');
    var users = require('./routes/users');

    //  Pass to Routers
    app.use('/users', users);
    app.use('/static', express.static('public'));
    app.use('/', routes(db, passport));

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // ======= Error Handlers =======

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });

    return app
}
