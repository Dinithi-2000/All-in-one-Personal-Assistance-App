const mongoose = require('mongoose');

const ServiceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Combined first and last name
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  serviceType: { type: String, required: true },
  location: { type: String, required: true },
  payRate: { type: [Number], required: true },
  selectedLanguages: { type: [String], required: true },
  about: { type: String, required: true },
  selectedServices: { type: [String], required: true },
  policeClearance: { type: String, required: true },
  photo: { type: String, required: true }, // Ensure the photo field is required
  selectedPetTypes: { type: [String] },
  selectedSyllabi: { type: [String] },
  selectedSubjects: { type: [String] },
  selectedGrades: { type: [String] },
  selectedAgeGroups: { type: [String] },
});

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);
