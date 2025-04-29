import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    serviceType: { type: String, required: true },
    selectedServices: { type: [String], required: true },
    location: { type: String, default: null },
    payRate: { type: [String], default: null },
    selectedLanguages: { type: [String], required: true },
    photo: { type: String, required: true },
    //about: { type: String, required: true },
    policeClearance: { type: String, default: null},
    availability: { type: String, default: null },
    selectedPetTypes: { type: [String] },
    selectedSyllabi: { type: [String] },
    selectedSubjects: { type: [String] },
    selectedGrades: { type: [String] },
    selectedAgeGroups: { type: [String] },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('provider_services', serviceSchema);
