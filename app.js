var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./routes/users');
var fs = require('fs-extra');
var request = require('request');

global.moment_timezone = require('moment-timezone');
global._ = require('underscore');
global.moment = require('moment');
var session = require('express-session');
var winston = require('winston');
require('winston-daily-rotate-file');

var extend = require('xtend');

global.async = require('asyncawait/async');
global.await = require('asyncawait/await');
var bulk_upload = require('./routes/bulk_upload');
var index = require('./routes/index');
var app = express();

require('./util/constants');
require('./util/functions');

//extra files which we require


//var busboy = require('connect-busboy');    //middleware for form/file upload
//var path = require('np');  //used for file path



APP_BASE_PATH = __dirname;

app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/', bulk_upload);
app.use('/', index);


var options = {
    //Initialization Options
    //promiseLib: promise
};
var pgp = require('pg-promise')(options); //promise module for pg 

var connectionString = 'postgres://postgres:postgres@localhost:5432/gameofthrone'; //protocol://dbUser:dbPassword@host:portno/dbname

global.db = pgp(connectionString);


var infoTransport = new winston.transports.DailyRotateFile({
    name: 'info-file',
    filename: LOG_INFO_FILE_PATH, // "./logs/info/info_log"
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: 'info',
    maxsize: 1024 * 1024 * 5, //5mb
    maxFiles: 5,
    json: false,
    timestamp: function() {
        return moment_timezone(Date.now()).tz(APP_TIME_ZONE).format('YYYY-MM-DD HH:mm:ss');
        //return Date.now();
    }
});

var errorTransport = new winston.transports.DailyRotateFile({
    name: 'error-file',
    filename: LOG_ERROR_FILE_PATH, // "./logs/error/error_log"
    datePattern: 'yyyy-MM-dd.',
    maxsize: 1024 * 1024 * 5, //5mb
    maxFiles: 5,
    prepend: true,
    level: 'error',
    json: false,
    timestamp: function() {
        return moment_timezone(Date.now()).tz(APP_TIME_ZONE).format('YYYY-MM-DD HH:mm:ss');
        //return Date.now();
    }
});

global.winstonLogger = new(winston.Logger)({
    transports: [
        infoTransport,
        errorTransport
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: LOG_EXCEPTION_FILE_PATH
        })
    ]
});


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
    console.log("500 error message" + err.message);
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;