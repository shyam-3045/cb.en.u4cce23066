# Notification System

A full stack Notification System developed as part of the Affordmed Full Stack Evaluation. The application is designed to handle student notifications related to Placements, Results and Events with support for filtering, pagination and priority based notification handling.

---

# Tech Stack

## Frontend
- React
- React Router
- React Query
- Axios
- Material UI
- Basic CSS

## Backend
- Node.js
- Express.js

---

# Features

## Notifications Page
- Fetch notifications from external API
- Pagination support
- Filter notifications by type
- Responsive UI for desktop and mobile
- Loading and error handling

## Priority Inbox
- Displays top priority unread notifications
- Priority calculated using:
  - Notification type weight
  - Recency
- Supports dynamic top `n` notifications

## Notification Handling
- Viewed notifications tracking
- Read / unread distinction
- Local state persistence using localStorage

## Backend Features
- Notification filtering
- Priority sorting
- Broadcast notification simulation
- Logging middleware integration
- REST API structure

---

# Priority Logic

Priority is calculated based on:
- Placement > Result > Event
- Recent notifications receive higher priority

Weights used:
- Placement = 3
- Result = 2
- Event = 1

Notifications are sorted using priority score and recency.

---

# Project Structure

```bash
backend/
│
├── services/
├── routes/
├── utils/
└── priorityInbox.js

notification-system/
│
├── src/
├── components/
├── pages/
├── customHooks/
└── styles/

screenshots/
demo.mp4
notification_system_design.md
```

---

# Frontend Setup

```bash
cd notification-system
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# Backend Setup

```bash
cd backend
npm install
npm start
```

---

# Additional Notes

- Logging middleware was used throughout the backend implementation.
- Priority Inbox logic was implemented separately as required in Stage 6.
- Screenshots and demo video are included in the repository.
- The application was developed with focus on clean UI, modular structure and scalability concepts.
