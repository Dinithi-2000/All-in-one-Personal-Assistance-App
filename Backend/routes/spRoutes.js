import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import speakeasy from 'speakeasy';
import ServiceProvider from '../models/ServiceProvider.js';

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

export default router;