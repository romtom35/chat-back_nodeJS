var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messageRouter = require('./routes/message');

var app = express();

// Socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('new message', message => io.emit('new message', message));
});

http.listen(4001, function () {
    console.log('listening on *:4001');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
    debug: true
}));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/chat', {useNewUrlParser: true });
app.locals.db = mongoose.connection;

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messageRouter);

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