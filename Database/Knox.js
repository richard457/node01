'use strict'
var knox = require('knox');
var fs = require('fs');
var Config = require('../Config/Config');

var knoxClient = knox.createClient({
  key: Config.S3AccessKey,
  secret: Config.S3SecretKey,
  bucket: Config.S3Bucket,
});

let s3upload = {
  uploadLeak: function(req, res, next){
    let path = req.file.path;
    let filename = req.file.filename;

    fs.readFile(path, function(err, buf){

      var s3req = knoxClient.put("/leaks/"+filename, {
        'Content-Length': buf.length,
        'Content-Type': 'image/jpeg',
      });

      s3req.on('response', function(s3res){
        if(s3res.statusCode == 200){
          fs.unlink(path, function(){
            next();
          });
        }else{
          req.status(400).end();
        }
      });

      s3req.end(buf);

    });

  },
  uploadPhoto: function(req, res, next){
    let path = req.file.path;
    let filename = req.file.filename;

    fs.readFile(path, function(err, buf){

      var s3req = knoxClient.put("/photos/"+filename, {
        'Content-Length': buf.length,
        'Content-Type': 'image/jpeg',
      });

      s3req.on('response', function(s3res){
        if(s3res.statusCode == 200){
          fs.unlink(path, function(){
            next();
          });
        }else{
          req.status(400).end();
        }
      });

      s3req.end(buf);

    });

  },
}

module.exports = s3upload;
