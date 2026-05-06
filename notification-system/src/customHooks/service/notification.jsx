import api from "../../utils/api";

export const getNotifications = async (page, limit) => {
  const res = await api.get(`/notifications?page=${page}&limit=${limit}`);
  return res.data;
};

export const getPriorityNotifications = async (n, studentId) => {
  const res = await api.get(
    `/notifications/priority?n=${n}&studentId=${studentId}`,
  );
  return res.data;
};
