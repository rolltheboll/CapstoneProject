const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true,},
  body: {type: String,required: true,},
  timestamp: {type: Date,default: Date.now,},
});

const inquirySchema = new mongoose.Schema(
  {
    student: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true,},
    listing: {type: mongoose.Schema.Types.ObjectId,ref: 'Listing',required: true,},
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
