const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAdminUsers,
  getAdminOrders,
  updateAdminOrderStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// All admin routes require protect + admin middleware
router.use(protect, admin);

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAdminUsers);
router.get('/orders', getAdminOrders);
router.put('/orders/:id', updateAdminOrderStatus);

module.exports = router;
