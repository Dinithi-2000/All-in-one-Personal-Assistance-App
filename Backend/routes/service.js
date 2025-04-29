import bcrypt from 'bcryptjs';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';

// models
import ServiceModel from '../models/ServiceModel.js';
import UserModel from '../models/UserModel.js';

const router = express.Router();


router.post('/add-new-service',
    expressAsyncHandler(async (req, res) => {
      const {
        serviceType,
        selectedServices,
        location,
        payRate,
        photo,
        policeClearance,
        availability,
        selectedLanguages,
        selectedPetTypes,
        selectedSyllabi,
        selectedSubjects,
        selectedGrades,
        selectedAgeGroups,
      } = req.body;

      const user = await UserModel.findById(req.user.id);
      if(!user){
        return res.status(400).send({ message: 'User Not Found.'})
      }
  
      // Validate required fields
      if (!serviceType || !selectedServices || !photo || !policeClearance) {
        return res.status(400).send({ message: 'Missing required fields.' });
      }
  
      try {
        await ServiceModel.create({
          userId: req.user.id,
          serviceType,
          selectedServices,
          location,
          payRate,
          photo,
          policeClearance,
          availability,
          selectedLanguages,
          selectedPetTypes,
          selectedSyllabi,
          selectedSubjects,
          selectedGrades,
          selectedAgeGroups,

        });
  
        return res.status(201).send({
          message: 'Service added successfully.',
        });
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    })
);

router.get('/get-my-services',expressAsyncHandler(async(req,res) => {
    const user = await UserModel.findById(req.user.id);

    if(!user){
        return res.status(404).send({ message: 'User Not Found.'})
    }
    try{
        const services = await ServiceModel.find({ userId: user._id });

        if(services.length > 0){
            return res.status(200).send(services);
        }else{
            return res.status(200).send([]);
        }

    }catch(error){
        return res.status(500).send({ message: error.message });
    }
}));

router.get('/get-services',expressAsyncHandler(async(req,res) => {
  const { serviceType = "ALL" } = req.query
  try{
    const query = {};
    if(serviceType == 'ALL'){
      delete query.serviceType
    }else{
      query.serviceType = serviceType
    }
    
    const services = await ServiceModel.find(query);

    if(services.length > 0){
      return res.status(200).send(services)
    }else{
      return res.status(200).send([])
    }

  }catch(error){
    return res.status(500).send({ message: error.message})
  }
}));

router.get('/get-service/:id',expressAsyncHandler(async(req,res) => {
  const { id } = req.params
  try{

    const service = await ServiceModel.findById(id);
  
    if(service){
      return res.status(200).send(service)
    }else{
      return res.status(404).send({ message: 'Not Found.'})
    }
  }catch(error){
    return res.status(500).send({ message: error.message})
  }
}));

export default router;