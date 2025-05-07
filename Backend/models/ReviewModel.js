import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    customerID: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    providerID: { type: mongoose.Types.ObjectId, required: true, ref: 'serviceproviders' },
    review: { type: String },
    starRate: { 
      type: Number,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1-5'
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model('reviews', ReviewSchema);