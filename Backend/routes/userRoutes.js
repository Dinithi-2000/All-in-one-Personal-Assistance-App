import bcrypt from 'bcryptjs';
import express, { response } from 'express';
import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import speakeasy from 'speakeasy';
import { generateToken } from '../utils.js';
import ServiceProvider from '../models/ServiceProvider.js';
import UserModel from '../models/UserModel.js';
import ReviewModel from '../models/ReviewModel.js';
import BookingModel from '../models/BookingModel.js';
import BookmarkModel from '../models/BookmarkModel.js';

const router = express.Router();

router.get(
    '/',
    expressAsyncHandler(async (req, res) => {
  
      try {
        const user = await UserModel.findOne(
          { _id: req.user.id },
          'firstName lastName mobile email address nic profile_pic cover_pic birthDay gender isServiceProvider about  externalSignUp createdAt updatedAt',
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
      const { firstName, lastName, mobile, birthDay, gender,about,nic, address } = req.body;
  
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
              nic,
              address
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

router.delete('/delete-user-account/:id',async(req,res) => {
  const { id } = req.params;
  try{
    const user = await UserModel.findById(req.user.id);
    if(!user){
      return res.status(404).send({ message: 'User Not Found!'});
    }
    const result = await UserModel.deleteOne({ _id: id });

    if(result.deletedCount > 0){
      return res.status(200).send({ message: 'User Account Permanently Deleted.'});
    }else{
      return res.status(400).send({ message: 'Delete Failed.'});
    }

  }catch(error){
    return res.status(500).send({ message: error.message });
  }
});

router.post('/review/post-review',
  expressAsyncHandler(async (req, res) => {
    const { providerID } = req.query;
    const { review, starRate } = req.body;
    try {
    
      const isThere = await ReviewModel.findOne({ customerID: req.user.id,providerID, });
      if (isThere) {
        return res.status(400).send({ message: 'Already Sumbit a Review' });
      }

      const taskerReview = new ReviewModel({
        customerID: req.user.id,
        providerID: providerID,
        review: review,
        starRate,
      });
      await taskerReview.save();

      return res.status(200).send({ message: 'SUCCESS' });

    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }),
);

router.get('/bookmark/my-bookmarks',
  expressAsyncHandler(async (req, res) => {
    try {
    
      const bookmarks = await BookmarkModel.find({ customerID: req.user.id},'-customerID -updatedAt').populate({
        path: 'providerID',
        model: ServiceProvider,
        select: '-policeClearance -selectedPetTypes -selectedSyllabi -selectedSubjects -selectedGrades -selectedAgeGroups -payRate'
      });
     
      if(bookmarks.length > 0){
        return res.status(200).send(bookmarks);
      }else{
        return res.status(200).send({ message: 'No Bookmarks found.'});
      }

    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }),
);

router.post('/bookmark/add-bookmark',
  expressAsyncHandler(async (req, res) => {
    const { providerID } = req.query;
    try {
    
      const isThere = await BookmarkModel.findOne({ customerID: req.user.id,providerID, });
      if (isThere) {
        return res.status(400).send({ message: 'Already add Bookmark.' });
      }

      await BookmarkModel.create({
        customerID: req.user.id,
        providerID
      })

      return res.status(200).send({ message: 'Bookmark Added.' });
      

    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }),
);

router.delete('/bookmark/remove-bookmark',
  expressAsyncHandler(async (req, res) => {
    const { providerID } = req.query;
    try {
    
      const ress = await BookmarkModel.findOne({ customerID: req.user.id,providerID });
      if(!ress){
        return res.status(404).send({ message: 'Not Found.'})
      }
    
      await BookmarkModel.deleteOne({ customerID: req.user.id,providerID })

      return res.status(200).send({ message: 'SUCCESS' });
      

    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }),
);

router.get('/review/my-reviews',expressAsyncHandler(async(req,res) => {
  try{
    const reviews = await ReviewModel.find({ providerID: req.user.id }).populate({
      path: 'customerID',
      model: UserModel,
      select: 'firstName lastName profile_pic email'
    })
    if(reviews.length > 0){
      return res.status(200).send(reviews);
    }else{
      return res.status(200).send({ message: 'No reviews.'})
    }

  }catch(error){
    return res.status(500).send({ message: error.message });
  }
}));

//MARK: Counts
router.get('/counts',expressAsyncHandler(async(req,res) => {
  try{
    
    const myBookings = await BookingModel.countDocuments({ customerID: req.user.id });
    const completedBookings = await BookingModel.countDocuments({ customerID: req.user.id,status: 'CONFIRMED' });
    const pendingBookings = await BookingModel.countDocuments({ customerID: req.user.id, status: 'PENDING' });

    return res.status(200).send({
      myBookings,
      completedBookings,
      pendingBookings
    })

  }catch(error){
    return res.status(500).send({ message: error.message });
  }
}));

  

export default router;
