const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

router.post(
  "/upload-slip",
  authMiddleware,
  upload.single("slipImage"),
  paymentController.uploadSlip
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  paymentController.getPayments
);

router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  paymentController.approvePayment
);

router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("admin"),
  paymentController.rejectPayment
);

module.exports = router;