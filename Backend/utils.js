import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const generateToken = (user) => {
    const payload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
      roleId: user.roleId,
    };
    const options = {
      expiresIn: '365d',
      issuer: 'x',
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
};
  