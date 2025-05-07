import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import UserModel from '../models/UserModel.js';

const router = express.Router();

// Get all users
router.get(
  '/get-all-users',
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await UserModel.find();
      if (users.length > 0) {
        return res.status(200).send(users);
      } else {
        return res.status(200).send([]);
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  })
);

// Delete a user
router.delete(
  '/delete-user/:id',
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      
      if (deletedUser) {
        return res.status(200).send({ 
          success: true, 
          message: 'User deleted successfully', 
          data: deletedUser 
        });
      } else {
        return res.status(404).send({ 
          success: false, 
          message: 'User not found' 
        });
      }
    } catch (error) {
      return res.status(500).send({ 
        success: false, 
        message: error.message 
      });
    }
  })
);

export default router;