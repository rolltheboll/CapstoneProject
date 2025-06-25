const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  getMyListings,
  deleteListing
} = require('../controllers/listing.controller');

router.post('/', auth, createListing);
router.get('/', getAllListings);
router.get('/my-listings', auth, getMyListings);
router.get('/:id', getListingById);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);


module.exports = router;
