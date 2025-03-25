const mongoose = require('mongoose');

const bioDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  bloodType: { type: String, required: true },
  allergies: { type: String },
  medicalConditions: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('BioData', bioDataSchema);