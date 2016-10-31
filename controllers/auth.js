const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secret = require('../config/tokens').secret;
const geocoder = require('geocoder');


function register(req, res){
  geocoder.geocode(req.body.postcode, function ( err, data ) {
    req.body.lat = data.results[0].geometry.location.lat;
    req.body.lng = data.results[0].geometry.location.lng;

    User.create(req.body, (err, user) => {
      console.log(err);
      if (err) return res.status(500).json({ message: "Something went wrong." });

      let payload = { _id: user._id, username: user.username };
      let token = jwt.sign(payload, secret, { expiresIn: 60*60*24 });

      return res.status(201).json({
        message: `Welcome ${user.firstName}!`,
        user,
        token
      });
    });
  });
}

function login(req, res){
 User.findOne({ email: req.body.email }, (err, user) => {
   if (err) return res.status(500).json({ message: "Something went wrong." });
   if (!user || !user.validatePassword(req.body.password)) {
     return res.status(401).json({ message: "Unauthorized." });
   }

   let payload = { _id: user._id, username: user.username };
   let token = jwt.sign(payload, secret, { expiresIn: 60*60*24 });

   return res.status(200).json({
     message: "Welcome back.",
     user,
     token
   });
 });
}

module.exports = {
 register: register,
 login:    login
};
