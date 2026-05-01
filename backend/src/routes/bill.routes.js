const express = require('express');
const billController = require('../controllers/bill.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware('admin'), billController.getBills);
router.post('/', roleMiddleware('admin'), billController.createBill);
router.get('/my/list', roleMiddleware('user'), billController.getMyBills);
router.get('/my/history', roleMiddleware('user'), billController.getMyHistory);
router.get('/:id', billController.getBillById);
router.put('/:id', roleMiddleware('admin'), billController.updateBill);

module.exports = router;