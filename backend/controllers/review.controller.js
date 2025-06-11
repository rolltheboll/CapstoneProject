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
