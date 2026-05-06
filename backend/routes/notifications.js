const express = require("express");
const {
  getNotificationsController,
  getPriorityController,
  markAsReadController,
  broadcastNotificationController,
} = require("../controllers/notificationController");
const router = express.Router();

router.get("/", getNotificationsController);
router.get("/priority", getPriorityController);
router.patch("/:id/read", markAsReadController);
router.post("/broadcast", broadcastNotificationController);

module.exports = router;
