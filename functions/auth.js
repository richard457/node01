'use strict'
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var Post = require('../models/Post');
var Event = require('../models/Event');
var Config = require('../Config/Config');


var Functions = {
  loginpage: function(req,res,next){
    res.render('login.html',{message: req.flash('loginMessage')});
  },
  signuppage:  function(req,res,next){
    res.render('signup.html',{message: req.flash('signupMessage')})
  },
  admin: function(req,res, next){
    var page = req.params.page ? req.params.page : 0;
    var skip = 10;

    var query = Post.find();
    query.skip(page*skip);
    query.sort({updatedAt: 'desc'});
    query.exec(function(err,docs){
      if(err){
        res.render('admin.html',{user: req.user});
      }else {
        res.render('admin.html',{user: req.user , docs: docs});
    }
  });

  },
  adminevents: function(req,res, next){
    var page = req.params.page ? req.params.page : 0;
    var skip = 10;

    var query = Event.find();
    query.skip(page*skip);
    query.sort({updatedAt: 'desc'});
    query.exec(function(err,docs){
      if(err){
        res.render('admin-events.html',{user: req.user});
      }else {
        res.render('admin-events.html',{user: req.user , docs: docs});
    }
    });
  },
  adminaddevent: function(req,res,next){
    if(req.method == "GET"){
      res.render('addevent.html');
    }else{

      if(req.body.title && req.body.details && req.body.location && req.body.program && req.body.date && req.body.time && req.file){

        var title = String(req.body.title.trim());
        var details = String(req.body.details.trim());
        var location = String(req.body.location.trim());
        var program = String(req.body.program.trim());
        var photo = req.file.filename;

        var date = req.body.date;
        var time = req.body.time;

        date = date+" "+time+":00";
        date = new Date(date);

        var e = new Event();

        e.user = req.user;
        e.photo = photo;
        e.details = details;
        e.title = title;
        e.location = location;
        e.program = program;
        e.date = date;

        console.log(e);

        e.save(function(err){
          if(err){
              res.render('addevent.html',{message: "There was an error , try again!"});
          }else{
              res.redirect('/auth/admin/events');
          }
        });
      }else{
        console.log(req.body);
        console.log(req.file);
        res.render('addevent.html', {message: "Please add missing information in the form"});
      }

    }
  },
  adminadd: function(req,res,next){
    if(req.method == "GET"){
      res.render('addpost.html');
    }else{

      if(req.body.title && req.body.post && req.file ){
        var title = String(req.body.title.trim());
        var post = String(req.body.post.trim());
        var photo = req.file.filename;

        var p = new Post();

        p.user = req.user;
        p.title = title;
        p.details = post;
        p.photo = photo;

        p.save(function(err){
          if(err){
              res.render('addpost.html',{message: "There was an error , try again!"});
          }else{
              res.redirect('/auth/admin');
          }
        });
      }else{
        res.render('addpost.html', {message: "Please add missing information in the form"});
      }

    }
  },
  logout: function(req,res , next){
    req.logout();
    res.redirect('/');
  },
  login: function(req, res, next){

    var email = String(req.body.phone);
    var password = String(req.body.password);

    console.log(req.body);

    User.findOne({email: email}, function(err, user){
      if(err){
          res.status(400).send("Wrong email number or password");
      }else{
        if(user && user.validPassword(password)){
          var token = jwt.sign(user._doc, Config.secret , {expiresIn: 2592000});
           user.password = undefined;

           var result = Object.assign({"token": token} , user._doc);

          res.status(200).json(result);
        }else{
          res.status(400).send("Wrong email number or password");
          console.log("wrong pass");
        }
      }
    })
  },
  signup: function(req, res, next){

    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var newUser = new User();


    newUser.name = String(name);
    newUser.email = String(email);
    newUser.valid = false;
    newUser.admin = false;
    newUser.password = newUser.generateHash(String(password));

    newUser.save(function(err){
      if(err){
        res.redirect('/auth/signup');
      }else {
        res.redirect('/auth/login');
      }
    });
  },
  auth: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }else{
      res.redirect('/');
    }
  }
}

module.exports = Functions;
