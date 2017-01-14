var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId , ref: 'User'},
  photo: String,
  details: String,
  title: String,
  location: String,
  program: String,
  date: {type: Date , default: Date.now()}
},{
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
