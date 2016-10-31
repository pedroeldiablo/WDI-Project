const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  image: { type: String, trim: true, unique: true },
  species: { type: String, trim: true, unique: true, required: true },
  maxLength: { type: Number, required: true }
});

module.exports = mongoose.model('Event', eventSchema);
