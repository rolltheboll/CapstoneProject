const Listing = require('../models/Listing');


const geocodeAddress = require('../config/mapbox');

exports.createListing = async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ msg: 'Only landlords can create listings' });
    }

    const { location } = req.body;
    const coordinates = await geocodeAddress(location); 

    const newListing = new Listing({
      ...req.body,
      landlord: req.user.id,
      coordinates 
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};



exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('landlord', 'name');
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('landlord', 'name');
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });

    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });

    if (listing.landlord.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });

    if (listing.landlord.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await listing.remove();
    res.status(200).json({ msg: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
