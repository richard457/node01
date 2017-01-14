var express = require('express');
var Post = require('../models/Post.js');
var Event = require('../models/Event.js');
var router = express.Router();
var nodemailer = require("nodemailer");

/* GET home page. */
router.get('/', function(req, res) {
  var query = Post.find({});
  query.sort({updatedAt: -1});
  query.limit(6);
  query.exec(function(err, posts){
    if(err){
      res.render("index",{link: 'index'});
    }else{
      var quer = Event.find({date:{$gt: new Date()}});
      quer.limit(5)
      quer.exec(function(err, docs){
        if(err){
          res.render("index",{link: 'index',posts: posts});
        }else{
          res.render("index",{link: 'index', docs: docs , posts: posts});
        }
      });
    }
  });
});
router.get('/who-we-are', function(req, res) {
  var query = Event.find({date:{$gt: new Date()}});
  query.limit(5)
  query.exec(function(err, docs){
    if(err){
      console.log(err);
      res.render("course-archive",{link: 'who-we-are'});
    }else{
      console.log(docs);
      res.render("course-archive",{link: 'who-we-are', docs: docs});
    }
  });
});
router.get('/EAUDC', function(req, res) {
  res.render("eaudc",{link: 'what-we-do' });
});
router.get('/NFUDC', function(req, res) {
  res.render("nfudc",{link: 'what-we-do' });
});
router.get('/adjudication', function(req, res) {
  res.render("adjudication",{link: 'what-we-do' });
});
router.get('/rwanda-speaks', function(req, res) {
  res.render("speaks",{link: 'what-we-do' });
});
router.get('/get-involved', function(req, res) {
  var query = Event.find({date:{$gt: new Date()}});
  query.limit(5)
  query.exec(function(err, docs){
    if(err){
      console.log(err);
      res.render("events-archive",{link: 'get-involved' });
    }else{
      console.log(docs);
      res.render("events-archive",{link: 'get-involved', docs: docs});
    }
  });
});
router.get('/gallery', function(req, res) {
  res.render("gallery",{link: 'gallery' });
});
router.get('/blogs', function(req, res) {
  var query = Post.find();
  query.sort({updatedAt: -1});
  query.limit(5);
  query.populate("user")
  query.exec(function(err,docs){
    if(err){
      res.render("blog-archive",{link: 'blogs' });
    }else{
      res.render("blog-archive",{link: 'blogs', docs: docs});
    }
  })

});
router.get('/contact-us', function(req, res) {
  res.render("contact",{link: 'contact-us' });
});
router.post('/contact-us', function(req,res){

  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var details = req.body.details;

  if(name != undefined && email != undefined && subject != undefined && details != undefined){
    var smtpTransport = nodemailer.createTransport('smtps://muberangabo.stapin%40gmail.com:Bebeto27@smtp.gmail.com');

    var mailOptions ={
      from: name+' <'+email+'>',
      to: "aspiredckist@gmail.com",
      subject: subject +" from "+email,
      text: details,
    }

    smtpTransport.sendMail(mailOptions, function(error,response){
      if(error){
        res.render("contact",{link: 'contact-us' , message: "There was an error, please try again" , state: "danger"});
      }else{
        res.render("contact",{link: 'contact-us' , message: "Thank you for your feedback!" , state: "success"});
      }

    })
  }
  //send email
})
module.exports = router;
