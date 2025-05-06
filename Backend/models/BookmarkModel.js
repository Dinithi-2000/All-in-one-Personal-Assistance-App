import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    customerID: { type: mongoose.Schema.Types.ObjectId, required: true },
    providerID: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'ServiceProvider', 
      required: true 
    },
    
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('bookmarks', bookmarkSchema);
