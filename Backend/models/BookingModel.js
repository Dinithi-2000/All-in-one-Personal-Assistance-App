import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customerID: { type: mongoose.Schema.Types.ObjectId, required: true },
  providerID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ServiceProvider', 
    required: true 
  },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  agreementDuration: { type: String, required: true },
  bookingService: { type: String, required: true },
  monthlyPayment: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED"],
    default: "PENDING",
  },
  bookingDate: { type: String, required: true },
  bookingTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  payments: [{ type: String }],
  rejectionReason: { type: String },
});

export default mongoose.model('bookings',bookingSchema);