import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: null },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, require: true },
    profile_pic: { type: String, default: null },
    cover_pic: { type: String, default: null },
    gender: { type: String, default: null },
    birthDay: { type: Date, default: null },
    bio: { type: String, default: null },
    about: { type: String, default: null },
    roleId: { type: Number, default: 1 },
    isServiceProvider: { type: Boolean, default: false },
    twoFactorAuthSecret: { type: String, default: null },
    externalSignUp: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('users', usersSchema);
