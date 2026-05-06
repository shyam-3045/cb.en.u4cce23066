import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getNotifications,
  getPriorityNotifications,
} from "../service/notification";

export const useNotifications = (page, limit, enabled = true) => {
  return useQuery({
    queryKey: ["notification", page, limit],
    queryFn: () => getNotifications(page, limit),
    enabled,
    placeholderData: keepPreviousData,
  });
};

export const usePriorityNotifications = (n, studentId, enabled = true) => {
  return useQuery({
    queryKey: ["priority-notification", n, studentId],
    queryFn: () => getPriorityNotifications(n, studentId),
    enabled,
    placeholderData: keepPreviousData,
  });
};
