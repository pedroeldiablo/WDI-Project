const mongoose = require('mongoose');

const sharkSchema = mongoose.Schema({
  image: { type: String, trim: true, unique: true },
  species: { type: String, trim: true, unique: true, required: true },
  maxLength: { type: Number, required: true }
});

module.exports = mongoose.model('Shark', sharkSchema);
