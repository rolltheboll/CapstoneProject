const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
