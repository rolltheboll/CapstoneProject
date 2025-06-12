const Favorite = require('../models/Favorite');


exports.addFavorite = async (req, res) => {
  try {
    const { listingId } = req.body;

    const exists = await Favorite.findOne({ student: req.user.id, listing: listingId });
    if (exists) return res.status(400).json({ msg: 'Already in favorites' });

    const favorite = new Favorite({
      student: req.user.id,
      listing: listingId
    });
    

    const saved = await favorite.save();
    console.log('Saved favorite:', saved);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ student: req.user.id }).populate('listing');
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ student: req.user.id, listing: req.params.listingId });
    res.status(200).json({ msg: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
