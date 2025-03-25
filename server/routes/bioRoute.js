const express = require('express');
const router = express.Router();
const { submitBioData } = require('./controllers/bioController');

router.post('/submit', submitBioData);

module.exports = router;
