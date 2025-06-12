const express = require('express');
const router = express.Router();
const { createReview, getReviewsByListing, deleteReview } = require('../controllers/review.controller');
const auth = require('../middleware/auth');

router.post('/', auth, createReview); 
router.get('/:id', getReviewsByListing); 
router.delete('/:id', auth, deleteReview);


module.exports = router;
