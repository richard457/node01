var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId , ref: 'User'},
  photo: String,
  title: String,
  details: String,
},{
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema)
