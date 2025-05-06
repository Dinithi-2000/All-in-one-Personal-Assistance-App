import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import speakeasy from 'speakeasy';
import ServiceProvider from '../models/ServiceProvider.js';
import BookingModel from '../models/BookingModel.js';
import ReviewModel from '../models/ReviewModel.js';
import UserModel from '../models/UserModel.js';

const router = express.Router();

router.get(
    '/get-user',
    expressAsyncHandler(async (req, res) => {
  
      try {
        const user = await ServiceProvider.findOne(
          { _id: req.user.id },
          'name email password serviceType location payRate about selectedLanguages selectedServices policeClearance photo selectedPetTypes selectedSyllabi selectedSubjects  selectedGrades selectedAgeGroups userType nic birthCertificate  availability gender isServiceProvider',
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
router.put(
    '/update-user',
    expressAsyncHandler(async (req, res) => {
        const {
            name,
            email,
            serviceType,
            location,
            payRate,
            selectedLanguages,
            about,
            selectedServices,
            selectedPetTypes,
            selectedSyllabi,
            selectedSubjects,
            selectedGrades,
            selectedAgeGroups,
            nic,
            availability,
            gender
          } = req.body;
  
      try {
        const response = await ServiceProvider.updateOne(
          { _id: req.user.id },
          { $set: {
            name,
            email,
            serviceType,
            location,
            payRate,
            selectedLanguages,
            about,
            selectedServices,
            selectedPetTypes,
            selectedSyllabi,
            selectedSubjects,
            selectedGrades,
            selectedAgeGroups,
            nic,
            availability,
            gender
          }}
        );
        
        if (response.modifiedCount > 0) {
          return res.status(200).send({ message: 'Updated.' });
        }
        if (response.modifiedCount == 0 && response.acknowledged == true) {
            return res.status(200).send({ message: 'Nothing to update.' });
          }
        if (response.acknowledged == false) {
            return res.status(200).send({ message: 'faild.' });
        }
  
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    }),
);

router.delete(
    '/delete-user-account',
    expressAsyncHandler(async (req, res) => {
  
      try {
        const response = await ServiceProvider.deleteOne({ _id: req.user.id })
        if(response.deletedCount > 0){
            return res.status(200).send({ message: 'Deleted!'});
        }else{
            return res.status(400).send({ message: 'Delete Faild.'});
        }
  
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    }),
);

router.post(
    '/bookings/my-bookings',
    expressAsyncHandler(async (req, res) => {
  
      try {
        const bookings = await BookingModel.find({ providerID: req.user.id });

        if(bookings.length > 0){
            return res.status(200).json(bookings);
        }else{
            return res.status(200).json({ message: 'Not Found'})
        }
        
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
      return res.status(200).send([])
    }

  }catch(error){
    return res.status(500).send({ message: error.message });
  }
}));


export default router;