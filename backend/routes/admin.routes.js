const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllUsers,
  deleteUser,
  getAllListings,
  deleteListing
} = require('../controllers/admin.controller');


router.get('/users', auth, getAllUsers);               
router.delete('/users/:userId', auth, deleteUser);     
router.get('/listings', auth, getAllListings);         
router.delete('/listings/:listingId', auth, deleteListing); 

module.exports = router;
