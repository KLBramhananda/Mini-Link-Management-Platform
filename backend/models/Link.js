const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  originalLink: { type: String, required: true },
  shortLink: { type: String, required: true, unique: true },
  remarks: { type: String, required: true },
  expirationDate: { type: Date }
});

module.exports = mongoose.model('Link', linkSchema);