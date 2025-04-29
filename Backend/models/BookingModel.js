import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    serviceId:  { type: mongoose.Schema.Types.ObjectId, required: true },
    agreementDuration: { type: String, required: true },
    monthlyPayment: { type: Number, required: true },
    status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED"],
    default: "PENDING",
    },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    payments: [{ type: String }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('bookings', bookingSchema);
