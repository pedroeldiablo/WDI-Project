const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username:  { type: String, unique: true, required: true },
  email:  { type: String, unique: true, required: true },
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
 username: json.username
};
return returnJson;

//blacklisting
   // delete json.passwordHash;
   // delete json.email;
   // delete json.__v;
   // return json;
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
