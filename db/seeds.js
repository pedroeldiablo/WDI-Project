const mongoose = require('mongoose');
const User = require('../models/user');

let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/events-api';
mongoose.connect(mongoUri);

User.collection.drop();

User.create([{
  firstName: "Mike",
  lastName: "Hayden",
  email: "mike.hayden@ga.co",
  age: 35,
  gender: "Male",
  interestedIn: "Female",
  postcode: "E1W 2RG",
  fact: "I once auditioned to be the Milky Bar Kid",
  profilePic: "https://avatars2.githubusercontent.com/u/3531085?v=3&s=400",
  password: "password",
  passwordConfirmation: "password"
},{
  firstName: "Kenneth",
  lastName: "Bone",
  email: "kenbone@example.com",
  age: 44,
  gender: "Male",
  interestedIn: "Female",
  postcode: "N17 0AP",
  fact: "...",
  profilePic: "http://media.salon.com/2016/10/kenneth_bone.jpg",
  password: "password",
  passwordConfirmation: "password"
}], (err, users) => {
  if(err) console.log("Error seeding users", err);
  console.log(`${users.length} users created`);

  mongoose.connection.close();
});
