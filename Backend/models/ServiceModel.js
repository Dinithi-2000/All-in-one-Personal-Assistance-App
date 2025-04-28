import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    serviceType: { type: String, required: true },
    selectedServices: { type: [String], required: true },
    location: { type: String, default: null },
    payRate: { type: [String], default: null },
    photo: { type: String, required: true },
    policeClearance: { type: String, required: true },
    availability: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('provider_services', serviceSchema);
