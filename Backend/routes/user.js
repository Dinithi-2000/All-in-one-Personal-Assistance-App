import bcrypt from 'bcryptjs';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import UserModel from '../models/UserModel.js';

const router = express.Router();

// Get user details
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
        console.log(user);
        
  
        return res.status(200).send(user);
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    }),
);

// Update user details
router.patch(
  '/update-profile',expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, mobile, birthDay, gender,about } = req.body;

    try {
    
      await UserModel.updateOne(
        { _id: req.user.id },
        {
          $set: {
            firstName,
            lastName,
            mobile,
            birthDay,
            gender,
            about,
          },
        },
      );
  
      return res.status(200).send({ message: 'User details updated.' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }),
);

router.post('/register-service-provider',expressAsyncHandler(async(req,res) => {
  try{
    const user = await UserModel.find(req.user.id);

    if(user){
      return res.status(404).send({ message: 'User not found.'});
    }
    if(user.isServiceProvider == true){
      return res.status(400).send(400).send({ message: 'Alredy registerd.'});
    }

    await UserModel.updateOne({ _id: user._id }, { $set: {
      isServiceProvider: true
    }} )

    return res.status(200).send({ message: 'Success.'})

  }catch(error){
    return res.status(500).send({ message: error.message });
  }
}));

router.post('/add-new-service',expressAsyncHandler(async(req,res) => {
  try{
    
  }catch(error){
    return res.status(500).send({ message: error.message });
  }
  return res.status()
}))

export default router;