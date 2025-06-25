const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {submitInquiry,getInquiriesForLandlord,getMyInquiries,deleteInquiry} = require('../controllers/inquiry.controller');


router.post('/', auth, submitInquiry);
router.get('/my', auth, getMyInquiries);
router.get('/landlord', auth, getInquiriesForLandlord);
router.delete('/:id', auth, deleteInquiry);
module.exports = router;
