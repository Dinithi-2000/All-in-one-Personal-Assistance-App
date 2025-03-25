const BioData = require('../models/BioData');

const submitBioData = async (req, res) => {
  try {
    const bio = new BioData(req.body);
    await bio.save();
    res.status(201).json({ message: 'Biological data saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

module.exports = { submitBioData };
