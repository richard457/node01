var Router = require('express').Router();
var Functions = require('../functions/auth');
var Upload = require('../functions/upload');

module.exports = function(passport){
  Router.get('/login', Functions.loginpage);
  Router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/auth/admin', // redirect to the secure profile section
        failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
  }));
  Router.get('/signup', Functions.signuppage);
  Router.post('/signup', Functions.signup);

  Router.get('/admin/events', Functions.auth, Functions.adminevents);

  Router.get('/admin/addpost', Functions.auth, Functions.adminadd);
  Router.post('/admin/addpost', Functions.auth,Upload.single('photo'),Functions.adminadd);

  Router.get('/admin/addevent', Functions.auth,Functions.adminaddevent);
  Router.post('/admin/addevent', Functions.auth, Upload.single('photo') , Functions.adminaddevent);

  Router.get('/admin/:page?', Functions.auth, Functions.admin);
  Router.get('/logout', Functions.auth, Functions.logout);
  return Router;
};
