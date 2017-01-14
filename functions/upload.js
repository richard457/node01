var multer = require('multer');
var path = require('path');
var os = require('os');
var mkdirp = require('mkdirp');


var generateFilename = function(filename){
  var ext_rex = /(?:\.([^.]+))?$/;
  var ext = ext_rex.exec(filename)[1];

  var id = '';
  var date = new Date().getTime();

  var ALL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < 15; i++) {
      const n = Math.floor(Math.random() * ALL.length);
      id = id + ALL.substring(n, n + 1);
  }
  id += date +'.'+ext;
  return id;

}
var storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, path.resolve(__dirname, '../public/uploads/'));
  },
  filename: function(req, file, cb){
      cb(null, generateFilename(file.originalname));
  }
});
var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
      var ext_rex = /(?:\.([^.]+))?$/;
      var ext = ext_rex.exec(file.originalname)[1];

      if(ext === 'jpg' || ext === 'png' ){
        cb(null, true)
      }else{
        cb(null, false)
      }
    },
    limits: {
      fields: 10,
      files: 1,
      fileSize: 2097152,
    },
  });

module.exports = upload;
