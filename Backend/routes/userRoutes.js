import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import speakeasy from 'speakeasy';
import { generateToken } from '../utils.js';
import ServiceProvider from '../models/ServiceProvider.js';
import UserModel from '../models/UserModel.js';

const router = express.Router();

router.get(
    '/',
    expressAsyncHandler(async (req, res) => {
  
      try {
        const user = await UserModel.findOne(
          { _id: req.user.id },
          'firstName lastName mobile email profile_pic cover_pic birthDay gender isServiceProvider about  externalSignUp createdAt updatedAt',
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

router.patch(
    '/update-profile-pic-and-cover',expressAsyncHandler(async (req, res) => {
      const { profile_pic,cover_pic } = req.body;
  
      try {
      
        await UserModel.updateOne(
          { _id: req.user.id },
          {
            $set: {
              profile_pic,cover_pic
            },
          },
        );
    
        return res.status(200).send({ message: 'User updated.' });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    }),
);
  

export default router;
