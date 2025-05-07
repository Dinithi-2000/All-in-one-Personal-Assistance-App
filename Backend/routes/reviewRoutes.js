import express from 'express';
import Review from '../models/ReviewModel.js';
import validateToken from '../middlwares/validateTokenHandler.js';
import UserModel from '../models/UserModel.js';
import ServiceProvider from '../models/ServiceProvider.js';

const router = express.Router();

// @route   GET api/admin/reviews
// @desc    Get all reviews
// @access  Private (Admin)
router.get('/reviews', validateToken, async (req, res) => {
  try {
    console.log('User from token:', req.user); // Debug log

    const reviews = await Review.find()
      .populate({
        path: 'customerID',
        model: UserModel,
        select: 'firstName lastName profileImage',
      })
      .populate({
        path: 'providerID',
        model: ServiceProvider,
        select: 'name logo',
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log('Found reviews:', reviews.length); // Debug log

    if (!reviews || reviews.length === 0) {
      return res.status(200).json([]);
    }

    // Normalize data for frontend
    const normalizedReviews = reviews.map(review => ({
      _id: review._id,
      customerName: review.customerID
        ? `${review.customerID.firstName || ''} ${review.customerID.lastName || ''}`.trim() || 'Anonymous'
        : 'Anonymous',
      customerImage: review.customerID?.profileImage || null,
      providerName: review.providerID?.name || 'Unknown Provider',
      providerLogo: review.providerID?.logo || null,
      reviewText: review.review || '',
      starRate: review.starRate || 0,
      createdAt: review.createdAt || '',
    }));

    res.json(normalizedReviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   DELETE api/admin/review/delete/:id
// @desc    Delete a review by ID
// @access  Private (Admin)
router.delete('/review/delete/:id', validateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;