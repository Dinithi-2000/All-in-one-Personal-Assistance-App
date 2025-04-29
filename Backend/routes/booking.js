import express from 'express';
import expressAsyncHandler from 'express-async-handler';

// models
import ServiceModel from '../models/ServiceModel.js';
import UserModel from '../models/UserModel.js';
import BookingModel from '../models/BookingModel.js';

const router = express.Router();

router.get('/get-my-bookings',expressAsyncHandler(async(req,res) => {
    const user = await UserModel.findById(req.user.id);

    if(!user){
        return res.status(404).send({ message: 'User Not Found.'})
    }
    try{
        const bookings = await BookingModel.find({ userId: user._id });

        if(bookings.length > 0){
            return res.status(200).send(bookings);
        }else{
            return res.status(200).send([]);
        }

    }catch(error){
        return res.status(500).send({ message: error.message });
    }
}));

router.post('/book-service',expressAsyncHandler(async(req,res) => {
    const { serviceId,providerId, agreementDuration,monthlyPayment,bookingDate,bookingTime } = req.body;
    try{

        const check = await BookingModel.findOne({providerId,serviceId,status: 'PENDING'});
        if(check){
            return res.status(400).send({ message: 'Alredy Booked.'})
        }
        await BookingModel.create({
            userId: req.user.id,
            providerId,
            serviceId,
            agreementDuration,
            monthlyPayment: parseFloat(monthlyPayment),
            bookingDate,
            bookingTime,
            status: "PENDING",
            payments: [],
        });

        return res.status(201).json({ message: "Booking created successfully"});

    }catch(error){
        return res.status(500).send({ message: error.message });
    }
}))


export default router;