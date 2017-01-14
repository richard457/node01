'use strict'
var Event  = require('../models/Event');
var moment = require('moment');
var ObjectId = require('mongoose').Schema.Types.ObjectId;

var Functions = {
  update: function(req,res,next){
    if(req.method == "GET"){
      var id = String(req.params.event);
      Event.findById(id,function(err,doc){
        if(err){
          res.render('updatevent.html',{message: "There was an error , try again!"});
        }else if (doc._id == undefined) {
          res.render('updatevent.html',{message: "No post found with that id."});
        }else{
          console.log(doc);
          res.render('updatevent.html',{doc: doc});
        }
      });
    }else{

      if(req.body.title && req.body.details && req.body.location && req.body.program && req.body.date && req.body.time ){

        var id = String(req.body.id);
        var title = String(req.body.title.trim());
        var details = String(req.body.details.trim());
        var location = String(req.body.location.trim());
        var program = String(req.body.program.trim());

        var date = req.body.date;
        var time = req.body.time;
        date = date+" "+time+":00";
        date = new Date(date);

        var p = {
          title: title,
          details: details,
          location: location,
          program: program,
          date: date,
        };

        Event.findByIdAndUpdate(id,p,function(err, doc){
          if(err){
            p._id = id;
            res.render('updatevent.html',{
              message: "There was an error , try again!",
              doc:p});
          }else{
            res.redirect('/auth/admin/events');
          }
        });
      }else{
        console.log(req.body);
        res.render('updatevent.html', {message: "Please add missing information  in the form"});
      }

    }
  },
  delete: function(req,res,next) {
    if(req.params.confirm){
      if (req.params.confirm == 1) {
        var id = String(req.params.event);
        Event.findByIdAndRemove(id,function(err,doc){
          if(err){
            res.redirect("/event/delete/"+id);
          }else{
            res.redirect("/auth/admin/events");
          }
        });
      }else{
        res.redirect("/auth/admin/events");
      }
    }else{
      var id = String(req.params.event);
      Event.findById(id,function(err,doc){
        if(err){
          res.render('deletevent.html',{message: "There was an error , try again!"});
        }else if (doc._id == undefined) {
          res.render('deletevent.html',{message: "No event found with that id."});
        }else{
          res.render('deletevent.html',{doc: doc});
        }
      });
    }
  },
  read: function(req,res,next){
    var id = String(req.params.event);
    var query = Event.findById(id);
    query.populate("user");
    query.exec(function(err,doc){
      if(err){
        next(err);
      }else{
        res.render('events-single',{doc: doc});
      }
    });
  },
  upcomming: function(req,res,next){
    var count = Number(req.params.count);
    var query = Event.find({date: {$gt: new Date()}});
    query.sort({date: 1});
    query.limit(count);
    query.exec(function(err, docs){
      if(err){
        res.json([]);
      }else{
        console.log(docs);
        res.json(docs);
      }
    })
  },
  recent: function(req,res,next){
    console.log("called");
    var count = Number(req.params.count);
    var query = Event.find({date: {$gt: new Date()}});
    query.sort({date: 1});
    if(req.params.skip != undefined){
      query.ne("_id",String(req.params.skip));
    }
    query.limit(count);
    query.exec(function(err, docs){
      if(err){
        console.log(err);
        res.json([]);
      }else{
        console.log(docs);
        res.json(docs);
      }
    })
  }
}
module.exports = Functions;
