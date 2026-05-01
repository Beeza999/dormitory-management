const express = require('express');
const roomController = require('../controllers/room.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roleMiddleware('admin'), roomController.createRoom);
router.put('/:id', roleMiddleware('admin'), roomController.updateRoom);
router.delete('/:id', roleMiddleware('admin'), roomController.deleteRoom);

module.exports = router;
