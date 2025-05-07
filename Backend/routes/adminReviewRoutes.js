import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import ReviewModel from '../models/ReviewModel.js';
import UserModel from '../models/UserModel.js';
import ServiceProvider from '../models/ServiceProvider.js';
import AdminModel from '../models/Adminisator/AdminModel.js';

const router = express.Router();

// Middleware to verify admin JWT token
const isAdminAuth = expressAsyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const admin = await AdminModel.findById(decoded.id);
    if (!admin) {
      return res.status(401).send({ message: 'Unauthorized: Admin not found' });
    }
    req.admin = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }
});

// GET: Fetch all reviews
router.get(
  '/reviews',
  isAdminAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const reviews = await ReviewModel.find({})
        .populate({
          path: 'customerID',
          model: UserModel,
          select: 'firstName lastName',
        })
        .populate({
          path: 'providerID',
          model: ServiceProvider,
          select: 'name',
        })
        .lean();

      // Normalize data for frontend
      const normalizedReviews = reviews.map(review => ({
        _id: review._id,
        customerName: review.customerID
          ? `${review.customerID.firstName || ''} ${review.customerID.lastName || ''}`.trim() || 'Unknown Customer'
          : 'Unknown Customer',
        providerName: review.providerID?.name || 'Unknown Provider',
        reviewText: review.review || '',
        starRate: review.starRate || 0,
        createdAt: review.createdAt || '',
      }));

      return res.status(200).send(normalizedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).send({ message: 'Failed to fetch reviews' });
    }
  })
);

// DELETE: Delete a review by ID
router.delete(
  '/review/delete/:id',
  isAdminAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid review ID' });
      }

      const review = await ReviewModel.findOneAndDelete({ _id: id });

      if (review) {
        return res.status(200).send({ message: 'Review deleted successfully' });
      } else {
        return res.status(404).send({ message: 'Review not found' });
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      return res.status(500).send({ message: 'Failed to delete review' });
    }
  })
);

// GET: Verify admin authentication
router.get(
  '/verify',
  isAdminAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      return res.status(200).send({ isAdmin: true });
    } catch (error) {
      console.error('Error verifying admin:', error);
      return res.status(500).send({ message: 'Verification failed' });
    }
  })
);

export default router;