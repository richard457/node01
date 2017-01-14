var express = require('express');
var http = require('http');
var exphbs = require('express-handlebars');
var db = require('./Database/Db.js');
var path = require('path');
var moment = require('moment');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var routes = require('./routes/index');
var Auth = require('./routes/auth');
var Post = require('./routes/post');
var Event = require('./routes/events');
var users = require('./routes/users');
var session = require('express-session');
var config = require('./Config/Config');
var env = process.env;

var app = express();
require('./Config/passport')(passport);
// view engine setup
var hbs = exphbs.create({
  helpers: {
    limitTitle: function(title){
      var t = String(title);
      if(t.length > 30){
        t = t.substring(0,31) + '...';
      }
      return t;
    },
    limitText: function(title){
      var t = String(title);
      if(t.length > 256){
        t = t.substring(0,256) + '...';
      }
      return t;
    },
    momentDate: function(date){
      var d = new Date(String(date));
      d = moment(d).format("ddd, MMM Do YYYY");
      return d;
    },
    active: function(link,route){
      var route = String(route);
      var link = String(link);
      var response =   link == route ? 'active': 'inactive';
      return response;
    }
  },
  partialsDir: "views/partials/",
  partials: {
    header: 'header',
  },
  extname: ".html",
})
app.set('views', path.join(__dirname, 'views'));
//app.enable('view cache');
app.set('view engine', '.html');
app.engine('.html',hbs.engine);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: config.secret}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/auth', Auth(passport));
app.use('/post', Post);
app.use('/event', Event);
app.use('/', routes);
//app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render("404");
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("404");
});

var server = http.createServer(app);
server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
