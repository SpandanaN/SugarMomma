var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongojs=require('mongojs');
//var db=mongojs('sugarmomma',['posts','users','postMsg']);
var db=mongojs('mongodb://sugarMommaDB:sugarMomma@ds027385.mongolab.com:27385/heroku_5635htnb');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//ADDED
app.set('port', (process.env.PORT || 5000));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);




app.get('/posts/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.collection('posts').findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
  //db.posts.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/posts/:id', function (req,res) {
  var id = req.params.id;
  console.log("likes");
  console.log(id);
  db.collection('posts').update(
  //db.posts.update(
    {_id: mongojs.ObjectId(id)},
    {$inc: {likes: 1}}
  );

});

app.get('/users/:email', function (req, res) {
  var email = req.params.email;
  console.log(email);
  console.log("hi");
  db.collection('users').findOne({email:email},function(err,doc){
  //db.users.findOne({email:email},function(err,doc){
    console.log("response");
    res.json(doc);
  });

});



app.post('/posts/:id',function(req,res){

  var id = req.params.id;
  console.log("let's post");
  var email = req.cookies.logged_in_user;

  console.log(req.body);
  db.collection('users').findOne({email:email},function(err,doc){
  //db.users.findOne({email:email},function(err,doc){
    var pic_url="../images/Brooke2.jpg";
    req.body.comment_author_dp=pic_url;
    db.collection('posts').update(
    //db.posts.update(
        {_id:mongojs.ObjectId(id)},
        {$addToSet:{comments_details:req.body}},function(err,doc){
          console.log(doc);
          res.json(doc);
        }
    );
  });

  console.log("updataed");
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

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


module.exports = app;
