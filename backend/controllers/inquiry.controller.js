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
      message
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
        select: 'title'
      })
      .populate('student', 'name email')
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
