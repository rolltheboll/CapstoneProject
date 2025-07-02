const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  submitInquiry,
  getInquiriesForLandlord,
  getMyInquiries,
  deleteInquiry,
  respondToInquiry,      
  addMessageToThread     
} = require('../controllers/inquiry.controller');
router.post('/', auth, submitInquiry);
router.get('/my', auth, getMyInquiries);
router.get('/landlord', auth, getInquiriesForLandlord);
router.delete('/:id', auth, deleteInquiry);
router.patch('/:id/respond', auth, respondToInquiry);
router.patch('/:id/messages', auth, addMessageToThread);

module.exports = router;
