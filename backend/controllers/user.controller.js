const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const Inquiry = require('../models/Inquiry');



exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role === 'student') {
      await Review.deleteMany({ student: userId });
      await Favorite.deleteMany({ student: userId });
      await Inquiry.deleteMany({ student: userId });
    }

   
    if (req.user.role === 'landlord') {
      const listings = await Listing.find({ landlord: userId });
      const listingIds = listings.map(l => l._id);

      await Review.deleteMany({ listing: { $in: listingIds } });
      await Inquiry.deleteMany({ listing: { $in: listingIds } });
      await Listing.deleteMany({ landlord: userId });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ msg: 'Account and related data deleted successfully.' });
  } catch (err) {
    console.error('Self-delete error:', err.message);
    res.status(500).json({ msg: 'Server error during account deletion' });
  }
};
