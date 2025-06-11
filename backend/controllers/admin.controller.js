const User = require('../models/User');
const Listing = require('../models/Listing');


exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getAllListings = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    const listings = await Listing.find().populate('landlord', 'name email');
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.deleteListing = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    await Listing.findByIdAndDelete(req.params.listingId);
    res.status(200).json({ msg: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
