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


exports.getMyListings = async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ msg: 'Only landlords can access their listings' });
    }

    const listings = await Listing.find({ landlord: req.user.id });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};




exports.getAllListings = async (req, res) => {
  try {
    const { city, housingType, maxPrice } = req.query;
    let filter = {};

    if (city) filter.location = new RegExp(city, 'i'); 
    if (housingType) filter.housingType = housingType;
    if (maxPrice) filter.price = { $lte: maxPrice };

    const listings = await Listing.find(filter).populate('landlord', 'name');
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

    if (
      listing.landlord.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await listing.deleteOne(); 
    res.status(200).json({ msg: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

