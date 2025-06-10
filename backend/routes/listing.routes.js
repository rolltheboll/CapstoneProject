const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing
} = require('../controllers/listing.controller');

router.post('/', auth, createListing);
router.get('/', getAllListings);
router.get('/:id', getListingById);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);

module.exports = router;
