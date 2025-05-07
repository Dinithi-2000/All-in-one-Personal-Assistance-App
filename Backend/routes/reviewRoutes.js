import express from 'express';
import Review from '../models/ReviewModel.js';
import validateToken from '../middlwares/validateTokenHandler.js';

const router = express.Router();

// @route   GET api/admin/reviews
// @desc    Get all reviews
// @access  Private (Admin)
router.get('/reviews', validateToken, async (req, res) => {
  try {
    console.log('User from token:', req.user); // Debug log

    const reviews = await Review.find()
      .populate('customerID', 'name')
      .populate('providerID', 'name')
      .sort({ createdAt: -1 })
      .lean();

    console.log('Found reviews:', reviews.length); // Debug log

    if (!reviews || reviews.length === 0) {
      return res.status(200).json([]);
    }

    res.json(reviews);
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