"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";
import useStore from "@/store/useStore";

export function useNotifications() {
  const { user } = useCurrentUser();
  const setNotificationCount = useStore((s) => s.setNotificationCount);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          const unread = (data.notifications || []).filter(
            (n: { read: boolean }) => !n.read
          ).length;
          setNotificationCount(unread);
        }
      } catch {
        // silently fail
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, setNotificationCount]);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PUT" });
      setNotificationCount(0);
    } catch {
      // silently fail
    }
  };

  return { notifications, markAllRead };
}
