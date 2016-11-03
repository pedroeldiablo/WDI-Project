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
  interestedIn: "Women",
  postcode: "E1W 2RG",
  lat: 51.5089393,
  lng: -0.0614053,
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
  interestedIn: "Women",
  postcode: "N17 0AP",
  lat: 51.6028157,
  lng: -0.070018,
  fact: "I earned over 200,000 twitter followers in less than 24 hours",
  profilePic: "http://66.media.tumblr.com/cec3ee8623ae75265db77701341638a0/tumblr_oeufxn9c9V1qgzdf6o1_500.jpg",
  password: "password",
  passwordConfirmation: "password"
},{
  firstName: "Sterling",
  lastName: "Archer",
  email: "sterlingarcher@example.com",
  age: 36,
  gender: "Male",
  interestedIn: "Women",
  postcode: "W1D 4HS",
  lat: 51.5121345,
  lng: -0.1346313,
  fact: "The most interesting person you'll ever meet",
  profilePic: "http://licensingbook.com/wp-content/uploads/2011/06/archer.jpg",
  password: "guest",
  passwordConfirmation: "guest"
},{
  firstName: "Bojack",
  lastName: "Horseman",
  email: "bojackhorseman@example.com",
  age: 52,
  gender: "Male",
  interestedIn: "Women",
  postcode: "N7 7AJ",
  lat: 51.5540315,
  lng: -0.111013,
  fact: "I used to be a star of a hit show called Horsin' Around",
  profilePic: "https://pbs.twimg.com/profile_images/761645430937522177/f5-8JkIE.jpg",
  password: "password",
  passwordConfirmation: "password"
},{
  firstName: "Ray",
  lastName: "Gillette",
  email: "raygillette@example.com",
  age: 37,
  gender: "Male",
  interestedIn: "Men",
  postcode: "SE1 6DP",
  lat: 51.4918063,
  lng: -0.1042003,
  fact: "I won a bronze medal in the mens giant slalom skiing in the olympics",
  profilePic: "http://vignette3.wikia.nocookie.net/p__/images/b/bf/Gillette.png/revision/latest?cb=20130406234745&path-prefix=protagonist",
  password: "guest",
  passwordConfirmation: "guest"
},{
  firstName: "Diane",
  lastName: "Nguyen",
  email: "dianenguyen@example.com",
  age: 36,
  gender: "Female",
  interestedIn: "Men",
  postcode: "BR3 4JP",
  lat: 51.4081874,
  lng: -0.0413848,
  fact: "I attended Boston University where I majored in Literature and Equine Studies",
  profilePic: "http://vignette1.wikia.nocookie.net/bojackhorseman/images/e/ea/Diane_Nguyen.jpg/revision/latest?cb=20140826055725",
  password: "password",
  passwordConfirmation: "password"
},{
  firstName: "Malory",
  lastName: "Archer",
  email: "maloryarcher@example.com",
  age: 58,
  gender: "Female",
  interestedIn: "Men/Women",
  postcode: "NW7 3AL",
  lat: 51.6435682,
  lng: -0.2737067,
  fact: "I'm allergic to zucchini",
  profilePic: "http://pre09.deviantart.net/a8c3/th/pre/i/2012/091/b/6/malory_archer_by_friagram-d4ulg2o.png",
  password: "guest",
  passwordConfirmation: "guest"
}], (err, users) => {
  if(err) console.log("Error seeding users", err);
  console.log(`${users.length} users created`);

  mongoose.connection.close();
});
