import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    customerID: { type: mongoose.Types.ObjectId, required: true },
    providerID: { type: mongoose.Types.ObjectId, required: true },
    review: { type: String },
    starRate: { 
      type: Number,
      min: 1,
      max: 5,
      validate:  {
        validator: Number.isInteger, 
        message: 'starRate must be an integer between 1 and 5',
      },
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export default mongoose.model('reviews', ReviewSchema);
