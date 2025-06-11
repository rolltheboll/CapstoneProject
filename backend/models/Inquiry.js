const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
