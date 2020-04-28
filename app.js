var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db=require('./model/db')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cardRouter = require('./routes/card');
const raceRouter = require('./routes/race')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./agenda')

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cards', cardRouter);
app.use('/races', raceRouter);

module.exports = app;
