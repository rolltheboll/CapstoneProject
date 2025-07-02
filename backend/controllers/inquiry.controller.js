const Inquiry = require('../models/Inquiry');
const Listing = require('../models/Listing');

exports.submitInquiry = async (req, res) => {
  try {
    const { listingId, message } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });

    const inquiry = new Inquiry({
      listing: listingId,
      student: req.user.id,
      messages: [{ sender: req.user.id, body: message }],
    });

    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getInquiriesForLandlord = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate({
        path: 'listing',
        match: { landlord: req.user.id },
        select: 'title',
      })
      .populate('student', 'name email')
      .populate('messages.sender', 'name email')
      .exec();

    const filtered = inquiries.filter(i => i.listing);
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ student: req.user.id })
      .populate('listing', 'title')
      .populate('messages.sender', 'name email')
      .exec();

    res.status(200).json(inquiries);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ msg: 'Inquiry not found' });

    if (inquiry.student.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this inquiry' });
    }

    await inquiry.deleteOne();
    res.status(200).json({ msg: 'Inquiry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.respondToInquiry = async (req, res) => {
  try {
    const { text } = req.body;
    const inquiry = await Inquiry.findById(req.params.id).populate('listing');

    if (!inquiry) return res.status(404).json({ msg: 'Inquiry not found' });

    const isLandlord = inquiry.listing.landlord.toString() === req.user.id;
    const isStudent = inquiry.student.toString() === req.user.id;

    if (!isLandlord && !isStudent) {
      return res.status(403).json({ msg: 'Not authorized to respond to this inquiry' });
    }

    inquiry.messages.push({ sender: req.user.id, body: text });
    await inquiry.save();

    res.status(200).json({ msg: 'Message added', inquiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.addMessageToThread = async (req, res) => {
  try {
    const { body } = req.body;
    const inquiry = await Inquiry.findById(req.params.id).populate('listing');

    if (!inquiry) return res.status(404).json({ msg: 'Inquiry not found' });

    const isLandlord = inquiry.listing.landlord.toString() === req.user.id;
    const isStudent = inquiry.student.toString() === req.user.id;

    if (!isLandlord && !isStudent) {
      return res.status(403).json({ msg: 'Not authorized to reply' });
    }

    inquiry.messages.push({
      sender: req.user.id,
      body,
      timestamp: new Date()
    });

    await inquiry.save();

    const populated = await Inquiry.findById(inquiry._id)
      .populate('student', 'name email')
      .populate('listing', 'title')
      .populate('messages.sender', 'name email');

    res.status(200).json({ msg: 'Message added', inquiry: populated });
  } catch (err) {
    console.error('Error in threaded reply:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
