const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createReport, getAllReports, deleteReport } = require('../controllers/report.controller');


router.post('/', auth, createReport);
router.get('/', auth, getAllReports);
router.delete('/:id', auth, deleteReport);
module.exports = router;
