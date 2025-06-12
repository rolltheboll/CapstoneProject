const express = require('express');
const router = express.Router();
const { getMyProfile, getAllUsers, deleteUser, deleteMyAccount } = require('../controllers/user.controller');
const auth = require('../middleware/auth');

router.get('/me', auth, getMyProfile);         
router.get('/', auth, getAllUsers);   
router.delete('/me', auth, deleteMyAccount);         
router.delete('/:id', auth, deleteUser);  
 

module.exports = router;
