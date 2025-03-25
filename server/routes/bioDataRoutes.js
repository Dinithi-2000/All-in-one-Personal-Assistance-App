const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getBioData,
  createOrUpdateBioData,
  deleteBioData
} = require('../controllers/bioDataController');

router.route('/')
  .get(protect, getBioData)
  .post(protect, createOrUpdateBioData)
  .delete(protect, deleteBioData);

module.exports = router;