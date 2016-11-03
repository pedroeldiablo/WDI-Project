const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  eventname: String,
  description: String,
  date: String,
  largeimageurl: String,
  link: String,
  entryprice: String,
  minage: String,
  openingtimes: [String],
  venue: [String]
});

module.exports = mongoose.model('Event', eventSchema);
