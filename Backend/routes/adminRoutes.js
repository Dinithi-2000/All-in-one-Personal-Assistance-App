import bcrypt from 'bcryptjs';
import express, { response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import UserModel from '../models/UserModel.js';

const router = express.Router();

router.get(
    '/get-all-users',
    expressAsyncHandler(async (req, res) => {
  
      try {
        const users = await UserModel.find();
        if (users.length > 0) {
            return res.status(200).send(users);
        }else{
            return res.status(200).send({ message: 'Not Found.' });
        }
  
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    }),
);

export default router;