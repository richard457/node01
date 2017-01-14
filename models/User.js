var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  name: {type : String, trim: true },
  email: {type: String},
  password: {type: String},
  valid: Boolean,
  admin: Boolean,
});

userSchema.methods.generateHash = function(ps) {
  return bcrypt.hashSync(ps, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(ps){
  return bcrypt.compareSync(ps, this.password);
}

module.exports = mongoose.model('User', userSchema);
