import bcrypt from 'bcryptjs';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import UserModel from '../models/UserModel.js';

const router = express.Router();

// MARK: User Profile Details
router.get(
    '/',
    expressAsyncHandler(async (req, res) => {
  
      try {
        const user = await UserModel.findOne(
          { _id: req.user.id },
          'firstName middleName lastName mobile email profile_pic cover_pic birthDay gender ABN_Number bio about roleId isTasker isEmailVerified isMobileVerified isVerifiedUser education onbordingMessage externalSignUp createdAt updatedAt',
        );
        if (!user) {
          return res.status(400).send({ message: 'User Not Found.' });
        }
  
        return res.status(200).send(user);
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    }),
  );

  export default router;