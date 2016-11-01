const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:  { type: String, required: true },
  email:  { type: String, unique: true, required: true },
  age:  { type: Number, required: true },
  gender:  { type: String, required: true },
  interestedIn:  { type: String, required: true },
  postcode:  { type: String, required: true },
  lat:  { type: Number, required: true },
  lng:  { type: Number, required: true },
  fact:  { type: String, required: true },
  profilePic:  { type: String, required: true },
  passwordHash:  { type: String, required: true },

});

function setPassword(value){
  this._password    = value;
  this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(8));
}

function setPasswordConfirmation(passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation;
}

function validatePasswordHash() {
  if (this.isNew) {
    if (!this._password) {
      return this.invalidate("password", "A password is required.");
    }

    if (this._password !== this._passwordConfirmation) {
      return this.invalidate("passwordConfirmation", "Passwords do not match.");
    }
  }
}

function validatePassword(password){
  return bcrypt.compareSync(password, this.passwordHash);
}
userSchema
.set('toJSON', {
  transform: function(doc, json) {

    //whitelisting
    let returnJson = {
      _id: json._id,
      firstName: json.firstName,
      lastName: json.lastName,
      email: json.email,
      gender: json.gender,
      interestedIn: json.interestedIn,
      postcode: json.postcode,
      fact: json.fact,
      profilePic: json.profilePic,
      age: json.age,
      lat: json.lat,
      lng: json.lng

    };
    return returnJson;
    
  }
});

userSchema
.virtual('password')
.set(setPassword);

userSchema
.virtual("passwordConfirmation")
.set(setPasswordConfirmation);

userSchema
.path("passwordHash")
.validate(validatePasswordHash);

userSchema.methods.validatePassword = validatePassword;

module.exports = mongoose.model("User", userSchema);
