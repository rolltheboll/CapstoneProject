const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  housingType: { type: String, enum: ['shared', 'private', 'homestay'], required: true },
  images: [{ type: String }], // String because it will be host on cloudinary hence URLS
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coordinates: { lat: { type: Number }, lng: { type: Number } },
  }, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
