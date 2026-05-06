import React, { useEffect, useState } from "react";
import {
  useNotifications,
  usePriorityNotifications,
} from "../customHooks/hooks/notification";
import FilterOptions from "../components/FilterOptions";
import NotificationsListPage from "../components/NotificationsListPage";

export const HomePage = () => {
  const [mode, setMode] = useState("normal");
  const [Currentpage, setCurrentPage] = useState(1);
  const [maxProductsPerPage, setMaxProductsPerPage] = useState(5);
  const [n, setN] = useState(4);
  const [studentId, setStudentId] = useState(1);
  const [filterType, setFilterType] = useState("");

  const { data, isLoading } = useNotifications(
    Currentpage,
    maxProductsPerPage,
    mode === "normal",
  );
  const { data: priorityData, isLoading: priorityLoading } =
    usePriorityNotifications(n, studentId, mode === "priority");

  const notifications = data?.body?.notifications || [];
  const typeOptions = [...new Set(notifications.map((p) => p.type))];
  const total = data?.body?.total || 0;
  const limit = data?.body?.limit || maxProductsPerPage;
  const pages = Math.ceil(total / limit) || 1;
  const priorityNotifications =
    priorityData?.body?.notifications || priorityData?.body || [];

  const normalFiltered =
    filterType && filterType !== ""
      ? notifications.filter((t) => t.type === filterType)
      : notifications;

  const activeNotifications =
    mode === "priority" ? priorityNotifications : normalFiltered;
  const loading = mode === "priority" ? priorityLoading : isLoading;

  useEffect(() => {
    setCurrentPage(1);
  }, [maxProductsPerPage, mode]);

  if (loading) {
    return <p className="page-message">Loading...</p>;
  }

  return (
    <div className="page-wrap">
      <header className="nav-bar">
        <div className="nav-inner">
          <h1 className="nav-title">Notification System</h1>
          <div className="nav-sub">Lightweight alerts for students</div>
        </div>
      </header>

      <div className="page-card page-shell">
        <FilterOptions
          mode={mode}
          setMode={setMode}
          Currentpage={Currentpage}
          setCurrentPage={setCurrentPage}
          maxProductsPerPage={maxProductsPerPage}
          setMaxProductsPerPage={setMaxProductsPerPage}
          n={n}
          setN={setN}
          studentId={studentId}
          setStudentId={setStudentId}
          options={typeOptions}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        <NotificationsListPage
          loading={loading}
          activeNotifications={activeNotifications}
          mode={mode}
          Currentpage={Currentpage}
          pages={pages}
          total={total}
          limit={limit}
          n={n}
          studentId={studentId}
        />
      </div>
    </div>
  );
};
