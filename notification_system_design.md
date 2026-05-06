# Stage 1

## APIs

GET /api/notifications?page=1&limit=10&notification_type=Placement

Response :

{
    "success": true,
    "msg": "fetched Notifications",
    "body": {
        "notifications": [
            {
                "id": "fd8e42f5-c3be-4158-8f53-553350fd6de7",
                "studentId": "1",
                "title": "Placement",
                "message": "Marriott International Inc. hiring",
                "type": "Placement",
                "priority": 3,
                "read": false,
                "createdAt": "2026-05-06T07:14:37.000Z"
            },
            {
                "id": "ee744c14-e62f-42b1-b619-e803fb5ecde3",
                "studentId": "1",
                "title": "Result",
                "message": "internal",
                "type": "Result",
                "priority": 2,
                "read": false,
                "createdAt": "2026-05-06T04:14:33.000Z"
            },
            {
                "id": "fb295089-9b88-43a5-86cf-30b2f8150214",
                "studentId": "1",
                "title": "Event",
                "message": "cult-fest",
                "type": "Event",
                "priority": 1,
                "read": false,
                "createdAt": "2026-05-06T03:44:29.000Z"
            },
            {
                "id": "3726af43-1446-4a83-b462-313b5df689a3",
                "studentId": "1",
                "title": "Event",
                "message": "induction",
                "type": "Event",
                "priority": 1,
                "read": false,
                "createdAt": "2026-05-05T17:14:25.000Z"
            },
            {
                "id": "5d072473-1ad7-4b46-9053-6ad1fde90e32",
                "studentId": "1",
                "title": "Result",
                "message": "mid-sem",
                "type": "Result",
                "priority": 2,
                "read": false,
                "createdAt": "2026-05-06T00:44:21.000Z"
            },
            {
                "id": "091bf605-c43f-423f-93b5-0c81ba4e71f9",
                "studentId": "1",
                "title": "Event",
                "message": "tech-fest",
                "type": "Event",
                "priority": 1,
                "read": false,
                "createdAt": "2026-05-05T18:44:17.000Z"
            },
            {
                "id": "a677df9f-a8db-4629-b861-8b2b031777c7",
                "studentId": "1",
                "title": "Placement",
                "message": "Visa Inc. hiring",
                "type": "Placement",
                "priority": 3,
                "read": false,
                "createdAt": "2026-05-05T12:44:13.000Z"
            },
            {
                "id": "8db5de5d-8cfd-4edf-9518-7483250adbd2",
                "studentId": "1",
                "title": "Result",
                "message": "external",
                "type": "Result",
                "priority": 2,
                "read": false,
                "createdAt": "2026-05-05T17:44:09.000Z"
            },
            {
                "id": "48a62fb1-d47a-4db2-aed8-355f5d575a59",
                "studentId": "1",
                "title": "Event",
                "message": "traditional-day",
                "type": "Event",
                "priority": 1,
                "read": false,
                "createdAt": "2026-05-06T00:44:05.000Z"
            },
            {
                "id": "15ab7ffc-bf86-4d0c-a20a-1045d0682709",
                "studentId": "1",
                "title": "Event",
                "message": "induction",
                "type": "Event",
                "priority": 1,
                "read": false,
                "createdAt": "2026-05-06T03:44:01.000Z"
            }
        ],
        "total": 20,
        "page": 1,
        "limit": 10
    }
}



GET /api/notifications/priority?n=10


Response:

{
    "success": true,
    "msg": "fetched Priority Notifications",
    "body": {
        "notifications": [
            {
                "id": "96302494-3520-4080-951b-2855c7d3e96d",
                "studentId": "1",
                "title": "Placement",
                "message": "PayPal Holdings Inc. hiring",
                "type": "Placement",
                "priority": 3,
                "read": false,
                "createdAt": "2026-05-06T07:43:37.000Z"
            },
            {
                "id": "fd8e42f5-c3be-4158-8f53-553350fd6de7",
                "studentId": "1",
                "title": "Placement",
                "message": "Marriott International Inc. hiring",
                "type": "Placement",
                "priority": 3,
                "read": false,
                "createdAt": "2026-05-06T07:14:37.000Z"
            },
            {
                "id": "30b50fd6-b3f5-4d3c-8162-bd3e1e162083",
                "studentId": "1",
                "title": "Placement",
                "message": "Advanced Micro Devices Inc. hiring",
                "type": "Placement",
                "priority": 3,
                "read": false,
                "createdAt": "2026-05-06T02:43:29.000Z"
            },
            {
                "id": "2c3065f5-9203-460f-a372-246ac603674f",
                "studentId": "1",
                "title": "Placement",
                "message": "PayPal Holdings Inc. hiring",
                "type": "Placement",
                "priority": 3,
                "read": false,
                "createdAt": "2026-05-05T23:13:53.000Z"
            },
            {
                "id": "694bcd27-2b21-4a84-ba3a-0855f44b08e8",
                "studentId": "1",
                "title": "Placement",
                "message": "Booking Holdings Inc. hiring",
                "type": "Placement",
                "priority": 3,
                "read": false,
                "createdAt": "2026-05-05T22:13:49.000Z"
            }
        ]
    }
}

PATCH /api/notifications/:id/read

POST /api/notifications/broadcast

Real time notifications are handled using WebSockets / Socket.IO.

# Stage 2

PostgreSQL is used because it supports indexing, relations and large scale querying efficiently.

Tables:

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  studentId INT,
  title VARCHAR(255),
  type VARCHAR(50),
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP
);
```

As data grows, queries become slower. This can be improved using indexing, pagination, caching and partitioning.

# Stage 3

Query becomes slow because the notifications table contains millions of rows and causes full table scans.

Optimized index:

```sql
CREATE INDEX idx_notifications
ON notifications(studentId, isRead, createdAt);
```

Adding indexes on every column is not efficient because inserts and updates become slower.

Placement notifications in last 7 days:

```sql
SELECT DISTINCT studentId
FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

# Stage 4

Performance can be improved using:
- Redis caching
- Pagination
- Lazy loading
- WebSockets instead of polling

Tradeoff:
Caching improves speed but increases memory usage.

# Stage 5

Current implementation is slow because email sending, DB writes and push notifications happen sequentially.

Improved approach:
- Save notification to DB
- Push jobs to RabbitMQ/Kafka
- Workers process emails asynchronously
- Failed jobs are retried

DB writes and email sending should be separated because email APIs may fail.

# Stage 6

Priority Inbox uses weight + recency.

Weights:
- Placement = 3
- Result = 2
- Event = 1

Notifications are sorted using priority score and latest notifications are ranked higher.

A Min Heap / Priority Queue can be used to maintain top 10 notifications efficiently when new notifications arrive.