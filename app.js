require('dotenv').config();

const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');//If we have a protected webpage that we want our users to login to access, without cookies, those users would have to login every time they refresh the page! That is because the HTTP protocol is by default “stateless”.
//Cookies introduce the concept of “persistent state” and allow the browser to “remember” something that the server told it previously.
//body parser already present in newer express versions
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('./models/user');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const moment = require('moment');
// const seedPosts = require('./seeds');
// seedPosts();

//--------------require routes
const index = require('./routes/index');
// const posts 	= require('./routes/posts');
const topics = require('./routes/topics');
const pviews = require('./routes/pviews');
const hubs = require('./routes/hubs');
const app = express();

//----------------connect to the database
mongoose.connect('mongodb://localhost:27017/unifiq', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify:true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('we\'re connected!');
});

//-------------------app configuration
// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
// set public assets directory
app.use(express.static('public'));
app.use(express.static('assets'));
//to remove a trivial error of Not Found
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(methodOverride('_method'));

//-------------Configure passport and sessions
app.use(session({
    secret: 'Hang ten dude',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());//The createStrategy is responsible to setup passport-local LocalStrategy with the correct options.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.locals.moment = moment;

//-----------Set local variables middleware
app.use(function(req, res, next){
  
  res.locals.currentUser = req.user;
  //set default page title
  res.locals.title = 'Unifiq1';
  //set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  //ser error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue on to next function in middleware chain
  next();

});

//---------Mount routes
app.use('/', index);
// app.use('/posts', posts);
app.use('/topics', topics);
app.use('/hubs', hubs);
app.use('/topics/:topic_id/posts/:id/pviews', pviews);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

//use for production version
app.use(function (req, res, next) {
  res.status(404).redirect('/invalid');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;
