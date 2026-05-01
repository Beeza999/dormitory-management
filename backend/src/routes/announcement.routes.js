const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcement.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/", authMiddleware, announcementController.getAnnouncements);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  announcementController.createAnnouncement
);

module.exports = router;