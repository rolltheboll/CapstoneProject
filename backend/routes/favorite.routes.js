const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favorite.controller');

router.post('/', auth, addFavorite); 
router.get('/', auth, getFavorites); 
router.delete('/:listingId', auth, removeFavorite); 

module.exports = router;
