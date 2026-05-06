const notificationService = require("../services/notificationService");
const Log = require("../utils/logger");

exports.getNotificationsController = async (req, res, next) => {
  try {
    const studentId = req.query.studentId || "1";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || null;
    const unread = req.query.unread || false;

    Log(
      "backend",
      "debug",
      "handler",
      `GET notifications: student=${studentId}, page=${page}, limit=${limit}, type=${type}, unread=${unread}`,
    );

    const result = await notificationService.getNotifications(
      studentId,
      page,
      limit,
      type,
      unread,
    );

    return res.status(200).send({
        success:true,
        msg:"fetched Notifications",
        body:result
    });
  } catch (err) {
    Log(
      "backend",
      "error",
      "handler",
      `Get notifications failed: ${err.message}`,
    );
    next(err);
  }
};

exports.getPriorityController = async (req, res, next) => {
  try {
    const studentId = req.query.studentId || "1";
    const n = parseInt(req.query.n) || 10;

    Log(
      "backend",
      "debug",
      "handler",
      `GET priority inbox: top ${n} notifications`,
    );

    const result = await notificationService.getPriorityInbox(studentId, n);


    return res.status(200).send({
        success:true,
        msg:"fetched Priority Notifications",
        body:result
    });
  } catch (error) {
    Log(
      "backend",
      "error",
      "handler",
      `Get priority inbox failed: ${error.message}`,
    );
    next(error);
  }
};

exports.markAsReadController = async (req, res, next) => {
  try {
    const notificationId = req.params.id;

    Log(
      "backend",
      "debug",
      "handler",
      `PATCH notification ${notificationId} to read`,
    );

    const notification = await notificationService.markAsRead(notificationId);

    if (!notification) {
      Log(
        "backend",
        "warn",
        "handler",
        `Notification ${notificationId} not found`,
      );
      return res.status(404).json({ error: "Notification not found" });
    }

    
    return res.status(200).send({
        success:true,
        msg:"Notification marked as read",
        body:[]
    });
  } catch (error) {
    Log("backend", "error", "handler", `Mark as read failed: ${error.message}`);
    next(error);
  }
};

exports.broadcastNotificationController = async (req, res, next) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message || !type) {
      Log("backend", "warn", "handler", "Broadcast missing required fields");
      return res
        .status(400)
        .json({ error: "Missing required fields: title, message, type" });
    }

    Log("backend", "warn", "handler", `POST broadcast: ${title}`);

    const result = await notificationService.broadcastNotification(
      title,
      message,
      type,
    );

    
    return res.status(200).send({
        success:true,
        msg:"Notification Broadcasted Successfully !",
        body:result
    });
  } catch (error) {
    Log("backend", "fatal", "handler", `Broadcast failed: ${error.message}`);
    next(error);
  }
};
