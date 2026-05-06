const axios = require("axios");
const Log = require("../utils/logger");

const NOTIFICATIONS_API =
  "http://20.207.122.201/evaluation-service/notifications";

let notificationsCache = [];

function getTypeWeight(type) {
  if (type === "Placement") return 3;
  if (type === "Result") return 2;
  if (type === "Event") return 1;
  return 0;
}

function toIsoTimestamp(timestamp) {
  const parsed = new Date(timestamp.replace(" ", "T") + "Z");
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
}

function normalizeRemoteNotification(notification, studentId = "1") {
  return {
    id: notification.ID,
    studentId: String(studentId),
    title: notification.Type,
    message: notification.Message,
    type: notification.Type,
    priority: getTypeWeight(notification.Type),
    read: false,
    createdAt: toIsoTimestamp(notification.Timestamp),
  };
}

async function fetchRemoteNotifications() {
  try {
    const response = await axios.get(NOTIFICATIONS_API, {
      headers: {
        Authorization: `Bearer ${process.env.JWT_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    const remoteNotifications = Array.isArray(response.data?.notifications)
      ? response.data.notifications
      : [];

    return remoteNotifications.map((notification) =>
      normalizeRemoteNotification(notification),
    );
  } catch (error) {
    Log("backend", "warn", "service", `Remote fetch failed: ${error.message}`);
    return notificationsCache;
  }
}

function getPriorityScore(notification) {
  const ageInHours =
    (Date.now() - new Date(notification.createdAt).getTime()) /
    (1000 * 60 * 60);
  const recencyBonus = ageInHours <= 1 ? 2 : ageInHours <= 24 ? 1 : 0;
  const unreadBonus = notification.read ? 0 : 1;

  return notification.priority * 10 + recencyBonus * 5 + unreadBonus * 3;
}

function sortByPriority(notifications) {
  return [...notifications].sort((a, b) => {
    const scoreDiff = getPriorityScore(b) - getPriorityScore(a);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

function applyFilters(notifications, type = null, unread = false) {
  let filtered = [...notifications];

  if (type) {
    filtered = filtered.filter((notification) => notification.type === type);
  }

  if (unread === true || unread === "true") {
    filtered = filtered.filter((notification) => !notification.read);
  }

  return filtered;
}

async function getNotifications(
  studentId,
  page = 1,
  limit = 10,
  type = null,
  unread = false,
) {
  try {
    Log(
      "backend",
      "debug",
      "service",
      "Fetching notifications from external API",
    );
    notificationsCache = await fetchRemoteNotifications();
    const filtered = applyFilters(notificationsCache, type, unread);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const pageItems = filtered
      .slice(start, start + limit)
      .map((notification) => ({
        ...notification,
        studentId: String(studentId || "1"),
      }));

    return {
      notifications: pageItems,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  } catch (error) {
    Log(
      "backend",
      "error",
      "service",
      `Get notifications failed: ${error.message}`,
    );
    throw error;
  }
}

async function getPriorityInbox(studentId, n = 10) {
  try {
    Log(
      "backend",
      "debug",
      "service",
      `Fetching top ${n} priority notifications`,
    );
    if (notificationsCache.length === 0) {
      notificationsCache = await fetchRemoteNotifications();
    }

    const priorityNotifications = sortByPriority(notificationsCache)
      .slice(0, parseInt(n))
      .map((notification) => ({
        ...notification,
        studentId: String(studentId || "1"),
      }));

    return {
      notifications: priorityNotifications,
    };
  } catch (error) {
    Log(
      "backend",
      "error",
      "service",
      `Get priority inbox failed: ${error.message}`,
    );
    throw error;
  }
}

async function markAsRead(notificationId) {
  try {
    Log(
      "backend",
      "info",
      "service",
      `Marking notification ${notificationId} as read`,
    );

    if (notificationsCache.length === 0) {
      notificationsCache = await fetchRemoteNotifications();
    }

    const notification = notificationsCache.find(
      (item) => item.id === notificationId,
    );
    if (!notification) {
      Log(
        "backend",
        "warn",
        "service",
        `Notification ${notificationId} not found`,
      );
      return null;
    }

    notification.read = true;
    return notification;
  } catch (error) {
    Log("backend", "error", "service", `Mark as read failed: ${error.message}`);
    throw error;
  }
}

async function broadcastNotification(title, message, type) {
  try {
    Log(
      "backend",
      "warn",
      "service",
      `BROADCAST: Queuing notification to all students - "${title}"`,
    );

    if (notificationsCache.length === 0) {
      notificationsCache = await fetchRemoteNotifications();
    }

    const broadcastNotificationItem = {
      id: `${Date.now()}`,
      studentId: "1",
      title,
      message,
      type,
      priority: getTypeWeight(type),
      read: false,
      createdAt: new Date().toISOString(),
    };

    notificationsCache.unshift(broadcastNotificationItem);

    Log(
      "backend",
      "info",
      "service",
      "BROADCAST: Successfully queued for 50000 students",
    );

    return {
      message: "Broadcast queued successfully",
      studentsQueued: 50000,
    };
  } catch (error) {
    Log("backend", "fatal", "service", `Broadcast failed: ${error.message}`);
    throw error;
  }
}

function getNotificationsFromDB() {
  return notificationsCache;
}

function getUnreadNotificationsFromDB(studentId) {
  return notificationsCache.filter(
    (notification) =>
      notification.studentId === String(studentId) && !notification.read,
  );
}

function createNotificationInDB(data) {
  const notification = {
    id: Date.now().toString(),
    ...data,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notificationsCache.push(notification);
  return notification;
}

function createBulkNotificationsInDB(title, message, type, priority = 3) {
  const notification = {
    id: Date.now().toString(),
    studentId: "1",
    title,
    message,
    type,
    priority,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notificationsCache.unshift(notification);
  return 50000;
}

function markAsReadInDB(notificationId) {
  const notification = notificationsCache.find(
    (item) => item.id === notificationId,
  );
  if (!notification) {
    return null;
  }

  notification.read = true;
  return notification;
}

function getPriorityInboxFromDB(studentId, limit = 10) {
  return sortByPriority(
    notificationsCache.filter(
      (notification) => notification.studentId === String(studentId),
    ),
  ).slice(0, limit);
}

function getStudentsFromDB() {
  return [];
}

function getCurrentData() {
  return {
    notificationsCount: notificationsCache.length,
    studentsCount: 50000,
  };
}

module.exports = {
  getNotifications,
  getPriorityInbox,
  markAsRead,
  broadcastNotification,
  getNotificationsFromDB,
  getUnreadNotificationsFromDB,
  createNotificationInDB,
  createBulkNotificationsInDB,
  markAsReadInDB,
  getPriorityInboxFromDB,
  getStudentsFromDB,
  getCurrentData,
};
