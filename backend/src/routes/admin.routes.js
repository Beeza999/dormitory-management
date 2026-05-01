const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));
router.get('/dashboard', adminController.getDashboard);
router.get('/reports', adminController.getReports);

module.exports = router;
