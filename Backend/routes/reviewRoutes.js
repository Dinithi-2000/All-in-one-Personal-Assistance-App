const express = require('express');
const router = express.Router();
const Review = require('../../models/Review');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET api/admin/reviews
// @desc    Get all reviews
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    // Verify admin role (assuming user role is stored in req.user)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const reviews = await Review.find()
      .populate('customerID', 'name')
      .populate('providerID', 'name')
      .lean();

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE api/admin/review/delete/:id
// @desc    Delete a review by ID
// @access  Private (Admin)
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;