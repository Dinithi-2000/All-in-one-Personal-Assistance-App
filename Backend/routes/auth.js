import bcrypt from 'bcryptjs';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import speakeasy from 'speakeasy';
import { generateToken } from '../utils.js';
import UserModel from '../models/UserModel.js';


const router = express.Router();

router.post(
    '/token',
    expressAsyncHandler(async (req, res) => {
      const { email, password } = req.body;
  
      const user = await UserModel.findOne({ email });
      const users = await  UserModel.find({})

      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          res.send({
            token: generateToken(user),
            status : user.status,
          });
        } else {
          res.status(400).send({ message: 'Invalid username or password' });
        }
      } else {
        res.status(400).send({ message: 'No Matching Account Found.' });
      }
    }),
);

router.post(
    '/register',
    expressAsyncHandler(async (req, res) => {
      const { firstName, lastName, email, mobile, password  } = req.body;
  
      try {
        const secret = speakeasy.generateSecret();
        const token = speakeasy.totp({
          secret: secret.base32,
          encoding: 'base32',
          step: 60,
        });
 
        const db_user = await UserModel.findOne({email});
  
        if (db_user) {
          if (db_user.isVerifiedUser === true) {
            return res.status(400).send({ message: 'User already Registered!' });
          }
  
          //await sendOTP(db_user, otpMethod, token);
  
          return res.send({ status: 'SUCCESS', message: 'Verification OTP sent' });
        }
  
        const hashPassword = await bcrypt.hash(password, 8);
        
        const user = new UserModel({
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobile: mobile,
          password: hashPassword,
          twoFactorAuthSecret: secret.base32,
        });
  
        await user.save();
        
        return res.send({ status: 'SUCCESS'});
        
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    }),
);

export default router;