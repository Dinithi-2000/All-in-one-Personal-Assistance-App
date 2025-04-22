import BioData from '../Model/BioData.js';

const handleError = (res, err, message = 'Server Error') => {
  console.error(err);
  
  let errorMessage = message;
  let field = null;
  
  if (err.name === 'ValidationError') {
    errorMessage = Object.values(err.errors).map(e => e.message).join(', ');
  } else if (err.code === 11000) {
    if (err.keyValue.nic) {
      errorMessage = 'This ID number is already registered';
      field = 'nic';
    } else if (err.keyValue.email) {
      errorMessage = 'This email is already registered';
      field = 'email';
    }
  }

  res.status(err.code === 11000 ? 400 : 500).json({ 
    success: false,
    message: errorMessage,
    field: field,
    error: err.message 
  });
};

const createOrUpdateBioData = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      nic,
      age,
      gender,
      bloodType
    } = req.body;

    // Validate required fields
    const requiredFields = {
      firstName: 'First name is required',
      lastName: 'Last name is required',
      email: 'Email is required',
      phoneNumber: 'Phone number is required',
      nic: 'NIC number is required'
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message,
          field
        });
      }
    }

    // Validate address
    if (!address || !address.street || !address.city || !address.state || !address.postalCode || !address.country) {
      return res.status(400).json({
        success: false,
        message: 'Complete address information is required',
        field: 'address'
      });
    }

    // Validate NIC format (supports both old and new formats)
    if (!/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(nic)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid NIC number (9 digits with optional V/X or 12 digits)',
        field: 'nic'
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
        field: 'email'
      });
    }

    // Validate phone number
    if (!/^[0-9]{10,15}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number (10-15 digits)',
        field: 'phoneNumber'
      });
    }

    let bioData = await BioData.findOne({ user: req.user._id });

    if (bioData) {
      // Update existing record
      bioData.firstName = firstName;
      bioData.lastName = lastName;
      bioData.email = email;
      bioData.phoneNumber = phoneNumber;
      bioData.address = address;
      bioData.nic = nic;
      if (age) bioData.age = age;
      if (gender) bioData.gender = gender;
      if (bloodType) bioData.bloodType = bloodType;
    } else {
      // Create new record
      bioData = new BioData({
        user: req.user._id,
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        nic,
        age,
        gender,
        bloodType
      });
    }

    const savedBioData = await bioData.save();
    res.status(200).json(savedBioData);
  } catch (err) {
    handleError(res, err);
  }
};

// Get bio data
const getBioData = async (req, res) => {
  try {
    const bioData = await BioData.findOne({ user: req.user._id });

    if (!bioData) {
      return res.status(404).json({
        message: 'No bio data found',
        exists: false
      });
    }

    res.json(bioData);
  } catch (err) {
    handleError(res, err, 'Failed to get bio data');
  }
};

// Delete bio data
const deleteBioData = async (req, res) => {
  try {
    const deleted = await BioData.findOneAndDelete({ user: req.user._id });

    if (!deleted) {
      return res.status(404).json({
        message: 'No bio data found to delete'
      });
    }

    res.json({
      message: 'Bio data deleted successfully'
    });
  } catch (err) {
    handleError(res, err, 'Failed to delete bio data');
  }
};

export {
  createOrUpdateBioData,
  getBioData,
  deleteBioData
};