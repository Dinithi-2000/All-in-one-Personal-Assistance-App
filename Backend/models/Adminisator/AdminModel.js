import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: null },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, require: true },
    profile_pic: { type: String, default: null },
    cover_pic: { type: String, default: null },
    gender: { type: String, default: null },
    nic: { type: String, default: null },
    address: { type: String, default: null },
    birthDay: { type: Date, default: null },
    about: { type: String, default: null },
    twoFactorAuthSecret: { type: String, default: null },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('admins', adminSchema);
