const Listing = require('../models/Listing');
const Inquiry = require('../models/Inquiry');



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
    const { location, housingType, priceMin, priceMax } = req.query;
    let filter = {};

    if (location) {
      filter.location = { $regex: new RegExp(location, 'i') }; 
    }

    if (housingType) {
      filter.housingType = housingType;
    }

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    const listings = await Listing.find(filter).populate('landlord', 'name');
    res.status(200).json(listings);
  } catch (err) {
    console.error(err);
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
      req.user.role !== 'admin' &&
      listing.landlord.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await Inquiry.deleteMany({ listing: req.params.id }); 
    await listing.deleteOne();

    res.status(200).json({ msg: 'Listing and related inquiries deleted' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};






