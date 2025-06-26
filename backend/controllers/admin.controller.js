const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const Inquiry = require('../models/Inquiry');


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

    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.role === 'student') {
      await Review.deleteMany({ student: userId });
      await Favorite.deleteMany({ student: userId });
      await Inquiry.deleteMany({ student: userId });
    }

    if (user.role === 'landlord') {
      const listings = await Listing.find({ landlord: userId });
      const listingIds = listings.map(l => l._id);

      await Review.deleteMany({ listing: { $in: listingIds } });
      await Inquiry.deleteMany({ listing: { $in: listingIds } });
      await Listing.deleteMany({ landlord: userId });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ msg: 'User and related data deleted' });

  } catch (err) {
    console.error(err);
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
