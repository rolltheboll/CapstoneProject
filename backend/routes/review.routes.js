const express = require('express');
const router = express.Router();
const { createReview, getReviewsByListing } = require('../controllers/review.controller');
const auth = require('../middleware/auth');

router.post('/', auth, createReview); 
router.get('/:id', getReviewsByListing); 

module.exports = router;
