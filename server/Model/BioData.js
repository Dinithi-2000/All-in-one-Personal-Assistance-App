const mongoose = require('mongoose');

const bioDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  nic: { type: String, required: true, unique: true },
  // Keeping some original fields for backward compatibility
  age: { type: Number },
  gender: { type: String },
  bloodType: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BioData', bioDataSchema);