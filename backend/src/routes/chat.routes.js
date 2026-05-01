const express = require("express");
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/:userId", chatController.getChatByUser);
router.post("/send", chatController.sendMessage);

module.exports = router;