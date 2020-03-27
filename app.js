var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors=require('cors');
const bodyParser = require('body-parser');

var app = express();

/*app.use(cors({
  origin:['http://localhost:4200','http://127.0.0.1:4200'],
  credentials:true
}));*/
//app.use(cors());
/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", url);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});*/
app.options('*', cors());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());//support parsing of application/json type post data
app.use(bodyParser.urlencoded({extended: false}));//support parsing of application/x-www-form-urlencoded post data
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
    if(req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH');
        return res.status(200).json({});
    }
    next();
});

var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');


//passport
var passport=require('passport');
var session=require('express-session');

app.use(session({
  name:'myname.sid',
  resave:false,
  saveUninitialized:false,
  secret:'secret',
  cookie:{
    maxAge:36000000,
    httpOnly:false,
    secure:false
  }
}))
require('./passport-config');
app.use(passport.initialize());
app.use(passport.session());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
