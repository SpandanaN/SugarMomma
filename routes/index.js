var express = require('express');
var router = express.Router();
var mongojs=require('mongojs');
var multer=require('multer');
var fs=require('fs');
var sendgrid = require('sendgrid')('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');
var randomstring = require("randomstring");
//var db=mongojs('sugarmomma',['posts','users','postMsg']);
var db=mongojs('mongodb://sugarMommaDB:sugarMomma@ds027385.mongolab.com:27385/heroku_5635htnb');

var kickbox = require('kickbox').client('826ba984e418a0a98527823f24406262058e288225781a3c8ecf93b589844b0e').kickbox();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SugarMomma' });
});

router.get('/myProfile', function(req, res, next) {
  res.render('posts');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});



router.get('/mapDisplay', function(req, res, next) {
  res.render('mapDisplay');

});

router.get('/faq', function(req, res, next) {
  res.render('faq');

});

router.get('/stories', function(req, res, next) {
  res.render('story');

});

router.get('/admin', function(req, res, next) {
  res.render('adminProfile');

});

router.get('/forgotPassword', function(req, res, next) {
  res.render('forgotPassword');

});

router.get('/usersList', function(req, res, next) {
  res.render('usersList');
});

router.post('/signup',function(req,res){
  db.collection('users').findOne({email:req.body.email},function(err,doc){
    console.log(doc);
    console.log("finish");
  });
});
/*router.post('/signup',function(req,res) {
  kickbox.verify(req.body.email, function (err, response) {

    if (response.body.result === 'deliverable') {
      // find each person with a email matching email submitted, selecting the email field
      db.collection('users').findOne({email: req.body.email}, {email: 1}, function (err, response) {
     // db.users.findOne({email: req.body.email}, {email: 1}, function (err, response) {
        if (err) {
          console.log('error in findOne database call');
          console.log(err);

        } else {

          if (response) {
            console.log(' email exists in database ');
            console.log(response);
            res.send({emailAlreadyExists: 'true', emailValid: 'true'});
          } else {
            var password = req.body.password;

            var crypto = require('crypto');
            var shasum = crypto.createHash('sha512');
            shasum.update(password);
            password = shasum.digest("base64");
            req.body.password = password;
            req.body.dp_src="userLogo.png";
            db.collection('users').insert(req.body, function (err, doc) {
           // db.users.insert(req.body, function (err, doc) {
                  if (err) {
                    console.log('not saved');
                  } else {
                    console.log(doc);
                    res.cookie('user', doc.email).send({emailAlreadyExists: 'false', emailValid: 'true'});
                  }

                }
            );


          }
        }

      });
    }
    else {

      res.send({emailAlreadyExists: 'false', emailValid: 'false'});
    }
  });
});*/

router.post('/cred',function(req,res,next) {
  var email = req.body.username;
  var password = req.body.password;
  var crypto = require('crypto');
  var shasum = crypto.createHash('sha512');
  shasum.update(password);
  password = shasum.digest("base64");

  db.collection('users').findOne({email: email, password: password}, function (err, response) {
  //db.users.findOne({email: email, password: password}, function (err, response) {
    if (err) {
      res.send({match: 0, error: 1});

    } else {
      if (response) {
        res.cookie('user', response.email).send({match: 1, error: 0, usr: response.name});
      }
      else {
        res.send({match: 0, error: 0});
      }

    }
  });
});

router.get('/cookie',function(req,res){
  var email = req.cookies.user;
  db.collection('users').findOne({email:email},function(err,doc){
  //db.users.findOne({email:email},function(err,doc){
    res.json(doc);
  });
});

router.post('/posts',function(req,res){
  console.log(req.body.msg);
  var email = req.cookies.user;

  db.collection('users').findOne({email:email},function(err,doc){
  //db.users.findOne({email:email},function(err,doc){
    console.log("testing");
    console.log(doc);
    var username=doc.name;
    var pic_url=doc.dp_src;
    db.collection('posts').insert(
    //db.posts.insert(
        {email:email,author:username,dp_src:pic_url,likes:0,comments:0,comments_details:[],message:req.body.msg},function(err,doc){
          console.log(doc);
          res.json(doc);
        }
    );
  });

});

router.get('/posts',function(req,res){
  console.log("hi");
  db.collection('posts').find().sort({_id:-1}).limit(25,function(err,docs){
  //db.posts.find().sort({_id:-1}).limit(25,function(err,docs){

    res.json(docs);
  });

});

router.get('/UserDetails/:id',function(req,res){
  var id = req.params.id;
  db.collection('posts').findOne({_id:mongojs.ObjectId(id)},function(err,doc){
  //db.posts.findOne({_id:mongojs.ObjectId(id)},function(err,doc){
    var email=doc.email;
    db.collection('users').findOne({email:email},function(err,doc){
    //db.users.findOne({email:email},function(err,doc){
      res.json(doc);
    })
  });
});

router.get('/users',function(req,res){
  db.collection('users').find(function(err,docs){
  //db.users.find(function(err,docs){
      res.json(docs);
  });
});

router.delete('/user/:email',function(req,res){
  var email=req.params.email;
  db.collection('users').remove({email:email},function(err,doc){
  //db.users.remove({email:email},function(err,doc){
      console.log(doc);
      res.json(doc);
  });
});

router.delete('/post/:id',function(req,res){
  var id=req.params.id;
  db.collection('posts').remove({_id:mongojs.ObjectId(id)},function(err,doc){
  //db.posts.remove({_id:mongojs.ObjectId(id)},function(err,doc){
      console.log(doc);
      res.json(doc);
  });
});

router.put('/changePassword',function(req,res){
    var email=req.cookies.user;
    var password=req.body.oldPassword;
    var newPassword=req.body.newPassword;
  var crypto = require('crypto');
  var shasum = crypto.createHash('sha512');
  shasum.update(password);
  password = shasum.digest("base64");

  var crypto = require('crypto');
  var shasum = crypto.createHash('sha512');
  shasum.update(newPassword);
  newPassword = shasum.digest("base64");
  db.collection('users').findOne({email:email},function(err,doc){
    //db.users.findOne({email:email},function(err,doc){
        if(doc.password===password){
          db.users.update({_id:mongojs.ObjectId(doc._id)},{$set:{password:newPassword}});
          res.send("match");
        }
        else{
          res.send("no match");
        }
    });
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/profilePic'); // Absolute path. Folder must exist, will not be created for you.
  },
  filename: function (req, file, cb) {
    cb(null, req.cookies.user + '-' +Date.now());
  }
})

var upload = multer({ storage: storage });

// upload the image file and store the url in database with the cookie containing email
router.post('/upload',upload.single('file'),function(req,res) {
  console.log('entered upload route');
  //console.log(req.body+"---request"); // form data
  console.log(req.file.filename + "---file is");// file uploaded will be here
  console.log(req.file.originalname + "---file is");
  console.log(req.file.path + "---file is");
  /*
   1. The image is uploaded to the dest. with its name.
   2. Every user has only one image in the db at any point , since new image's replace the old one.
   3. Save the image file name to database and send it whenever a user logins to his account
   */

  db.collection('users').findOne({email: req.cookies.user}, function (err, user) {
  //db.users.findOne({email: req.cookies.user}, function (err, user) {
    if (err) {
      console.log('error in findOne database call');
      console.log(err);

    }

    ////delete the previous image file of this user

    else {
      /*fs.unlink('./public/images/profilePic/' + user.dp_src, function (err) {

        console.log(user.dp_src);
        if (err) throw err;
        console.log('successfully deleted /tmp/hello');
      });*/

      console.log(req.file.filename);
      db.collection('users').update({email:user.email},{$set:{dp_src:req.file.filename}},function(err,doc){
      //db.users.update({email:user.email},{$set:{dp_src:req.file.filename}},function(err,doc){
        if (err) {
          console.log("image url not updated");
        }
        else{

          db.collection('users').findOne({email:user.email},function(err,docs){
          //db.users.findOne({email:user.email},function(err,docs){
            console.log(docs);
            console.log("image url updated "+docs.dp_src);
            res.send(docs.dp_src);
          })
        }

      })



      //console.log('user from db on change and save is:----'+user);



    }


  });

});


router.post('/forgotPassword',function(req,res,next) {

  console.log(req.body.email);

  db.collection('users').findOne({email: req.body.email}, function (err, response) {
  //db.users.findOne({email: req.body.email}, function (err, response) {
    console.log(response);
    if (response) {

//1.generate a random string to send as password
      console.log("random string is ---------" + randomstring.generate(7));
      var tempPassword = randomstring.generate(7);

      //2. save the temporary password in database
      //-- generate a hash using bcrypt for the temporary password

      var crypto = require('crypto');
      var shasum = crypto.createHash('sha512');
      shasum.update(tempPassword);
      var password = shasum.digest("base64");
      db.collection('users').update({email: req.body.email}, {$set: {password: password}});
      //db.users.update({email: req.body.email}, {$set: {password: password}});


      //3. send email to user
      console.log('response.email is-------------' + response.email);
      sendgrid.send({
        to: response.email,
        from: 'SugarMommas@admin.com',
        subject: 'Temporary Password',
        text: 'Your temporary password is ' + tempPassword + '. Use this to login.'
      }, function (err, json) {
        if (err) {
          return console.error(err);
        }
        console.log(json);
      });
      console.log('email sent-------to-----' + response.email);
      res.send({
        message: 'Check your email for temporary password',
        consoleMessage: 'email exists and has been updated with temp. password'
      });
    }
    else {
// if the response is null, send a message
      res.send({
        message: 'email does not exist , register to the website',
        consoleMessage: 'email does not exist , register to the website'
      });
    }

  });
});

router.get('/userListProfile/:id',function(req,res){
  var id=req.params.id;
  db.collection('users').findOne({_id:mongojs.ObjectId(id)},function(err,doc){
  //db.users.findOne({_id:mongojs.ObjectId(id)},function(err,doc){
    res.json(doc);
  })
});

router.post('/sendContactEmail',function(req,res){
  console.log(req.body.email);
  sendgrid.send({
    to: req.body.email,
    from: 'SugarMommas@admin.com',
    subject: 'Message from '+req.body.username+'.(Sugar Mommas)',
    text: 'Sender details: \n Name: ' + req.body.username + '\n Lives in: '+req.body.city+'\n Message : '+req.body.message
  }, function (err, json) {
    if (err) {
      res.send({
        message: "Couldn't send your message. Try again."
      });
    }
    console.log(json);
  });
  res.send({
    message: 'Message sent successfully'
  });

});


module.exports = router;
