const express = require('express');
const tenantController = require('../controllers/tenant.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));
router.get('/', tenantController.getTenants);
router.post('/', tenantController.createTenant);
router.get('/:id', tenantController.getTenantById);
router.put('/:id', tenantController.updateTenant);
router.patch('/:id/toggle-status', tenantController.toggleTenantStatus);
router.delete('/:id', tenantController.deleteTenant);

module.exports = router;