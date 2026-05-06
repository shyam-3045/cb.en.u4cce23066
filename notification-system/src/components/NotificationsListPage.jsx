import React from "react";

const NotificationsListPage = ({
  loading,
  activeNotifications,
  mode,
  Currentpage,
  pages,
  total,
  limit,
  n,
  studentId,
}) => {
  if (loading) {
    return <p className="page-loading">... Loading Notifications</p>;
  }

  return (
    <div className="list-wrap">
      <div className="list-items">
        {activeNotifications.map((notification) => {
          const borderColor =
            notification.priority >= 2 ? "#ff6b6b" : "#34d399";
          return (
            <div
              key={notification.id}
              className="list-card"
              style={{ borderLeft: `6px solid ${borderColor}` }}
            >
              <div className="list-top">
                <p className="list-id">ID: {notification.id}</p>
                <div className="list-badges">
                  <span className="badge">{notification.type}</span>
                  <span className="badge muted">P{notification.priority}</span>
                </div>
              </div>

              <p className="list-title">{notification.title}</p>

              <div className="list-middle">
                <p className="muted">{notification.message}</p>
                <p className="muted small">{notification.createdAt || ""}</p>
              </div>

              <div className="list-bottom">
                {mode === "priority" ? (
                  <>
                    <p className="small">n: {n}</p>
                    <p className="small">Student ID: {studentId}</p>
                  </>
                ) : (
                  <>
                    <p className="small">Page: {Currentpage}</p>
                    <p className="small">Limit: {limit}</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="list-footer">
        {mode === "priority" ? (
          <p className="muted">
            n: {n} | Student ID: {studentId}
          </p>
        ) : (
          <p className="muted">
            Page {Currentpage} / {pages} | Total: {total} | Limit: {limit}
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationsListPage;
