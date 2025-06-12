const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {submitInquiry,getInquiriesForLandlord,getMyInquiries} = require('../controllers/inquiry.controller');


router.post('/', auth, submitInquiry);
router.get('/my', auth, getMyInquiries);
router.get('/landlord', auth, getInquiriesForLandlord);

module.exports = router;
