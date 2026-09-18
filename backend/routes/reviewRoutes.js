const express = require('express');
const router = express.Router();
const {
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Updating/deleting reviews requires authentication

router.route('/:id')
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;
