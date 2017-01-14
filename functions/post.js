'use strict'
var Post  = require('../models/Post');
var moment = require('moment');
var ObjectId = require('mongoose').Schema.Types.ObjectId;

var Functions = {
  update: function(req,res,next){
    if(req.method == "GET"){
      var id = String(req.params.post);
      Post.findById(id,function(err,doc){
        if(err){
          res.render('updatepost.html',{message: "There was an error , try again!"});
        }else if (doc._id == undefined) {
          res.render('updatepost.html',{message: "No post found with that id."});
        }else{
          console.log(doc);
          res.render('updatepost.html',{doc: doc});
        }
      });
    }else{


      if(req.body.title && req.body.post){

        var id = String(req.body.id);
        var title = String(req.body.title.trim());
        var post = String(req.body.post.trim());

        var p = {
          title: title,
          details: post,
        };

        Post.findByIdAndUpdate(id,p,function(err, doc){
          if(err){
            res.render('updatepost.html',{message: "There was an error , try again!",doc:{_id: id , title: title, details: post}});
          }else{
            res.redirect('/auth/admin');
          }
        });
      }else{
        res.render('updatepost.html', {message: "Please add missing information  in the form"});
      }

    }
  },
  delete: function(req,res,next) {
    if(req.params.confirm){
      if (req.params.confirm == 1) {
        var id = String(req.params.post);
        Post.findByIdAndRemove(id,function(err,doc){
          if(err){
            res.redirect("/post/delete/"+id);
          }else{
            res.redirect("/auth/admin");
          }
        });
      }else{
        res.redirect("/auth/admin");
      }
    }else{
      var id = String(req.params.post);
      Post.findById(id,function(err,doc){
        if(err){
          console.log(err);
          console.log("err");
          res.render('deletepost.html',{message: "There was an error, try again!"});
        }else if (doc._id == undefined) {
          res.render('deletepost.html',{message: "No post found with that id."});
        }else{
          res.render('deletepost.html',{doc: doc});
        }
      });
    }
  },
  read: function(req,res,next){
    var id = String(req.params.post);
    var query = Post.findById(id);
    query.populate("user");
    query.exec(function(err,doc){
      if(err){
        next(err);
      }else{
        res.render('blog-single',{doc: doc});
      }
    });
  },
  recent: function(req,res,next){
    var count = Number(req.params.count);
    var query = Post.find({});
    query.sort({updatedAt: -1});
    if(req.params.skip != undefined){
      query.ne("_id",String(req.params.skip));
    }
    query.limit(count);
    query.populate("user","name",null,null);
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
