const BioData = require('../Model/BioData');

const handleError = (res, err, message = 'Server Error') => {
  console.error(err);
  res.status(500).json({ 
    message,
    error: err.message 
  });
};

// Create or update bio data
const createOrUpdateBioData = async (req, res) => {
  try {
    const { age, gender, height, weight, bloodType, allergies, medicalConditions } = req.body;
    
    // Validate required fields
    if (!age || !gender || !height || !weight || !bloodType) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    let bioData = await BioData.findOne({ user: req.user._id });

    if (bioData) {
      // Update existing record
      bioData.age = age;
      bioData.gender = gender;
      bioData.height = height;
      bioData.weight = weight;
      bioData.bloodType = bloodType;
      bioData.allergies = allergies || null;
      bioData.medicalConditions = medicalConditions || null;
    } else {
      // Create new record
      bioData = new BioData({
        user: req.user._id,
        age,
        gender,
        height,
        weight,
        bloodType,
        allergies,
        medicalConditions
      });
    }

    const savedBioData = await bioData.save();
    res.status(200).json(savedBioData);
  } catch (err) {
    handleError(res, err, 'Failed to save biomedical data');
  }
};

// Get bio data
const getBioData = async (req, res) => {
  try {
    const bioData = await BioData.findOne({ user: req.user._id });
    
    if (!bioData) {
      return res.status(404).json({ 
        message: 'No biomedical data found',
        exists: false
      });
    }
    
    res.json(bioData);
  } catch (err) {
    handleError(res, err, 'Failed to get biomedical data');
  }
};

// Delete bio data
const deleteBioData = async (req, res) => {
  try {
    const deleted = await BioData.findOneAndDelete({ user: req.user._id });
    
    if (!deleted) {
      return res.status(404).json({ 
        message: 'No biomedical data found to delete' 
      });
    }
    
    res.json({ 
      message: 'Biomedical data deleted successfully'
    });
  } catch (err) {
    handleError(res, err, 'Failed to delete biomedical data');
  }
};

module.exports = {
  createOrUpdateBioData,
  getBioData,
  deleteBioData
};