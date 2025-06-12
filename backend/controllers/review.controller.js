const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { listing, rating, comment } = req.body;

    const review = new Review({
      listing,
      student: req.user.id,
      rating,
      comment
    });

    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getReviewsByListing = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.id }).populate('student', 'name');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    
    if (review.student.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
