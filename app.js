var config = require('./config');
var env = process.env.NODE_ENV || config.env;
if (env === "production") {
  require('newrelic');
}
//数据库连接
require('./service/dbconnect')(config);

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exhbs = require('express-handlebars');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var routers = require('./routers');
var rsb = require('./common/rightsidebar');
var hbshelper = require('./common/hbshelper');
var proverbs = require('./common/proverbs');
//var registerModels = require('./common/register_model')
var app = express();
process.env.PORT = config.port;
//registerModels(app);

app.engine('hbs', exhbs(hbshelper));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

if (env === "development") {
  app.use(logger('dev'));
}
proverbs.set();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  secret           : 'panblog',
  store            : new MongoStore({
    host    : config.db.host,
    port    : config.db.port,
    db      : config.db.database,
    username: config.db.user,
    password: config.db.pwd,
    ttl     : 14 * 24 * 60 * 60
  }),
  resave           : true,
  saveUninitialized: true
}));

//right sidebar data bind and set env to views
app.use(rsb);

//proverbs
app.use(proverbs.get);

app.use(function (req, res, next) {
  res.locals.production = env === "production";
  next();
});

app.use('/', routers);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(err.status);
  next(err);
});

/// error handlers


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  var data = {layout: false};
  if (env === 'development') {
    data.message = err.message;
    data.error = err;
  }
  else {
    data.title = {
      404: '木有这个页面，orz',
      500: '伍佰来了，次奥'
    }[res.statusCode];
  }
  res.render('err', data);
});


module.exports = app;
