import { useEffect, useCallback, useRef } from "react";

const API_BASE = "http://127.0.0.1:5000/api";

// Helper to get or create a session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("portfolio_session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("portfolio_session_id", sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const track = useCallback(async (eventType: string, resourceId: string = "", metadata: any = {}) => {
    try {
      await fetch(`${API_BASE}/analytics/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: eventType,
          resource_id: resourceId,
          metadata: metadata,
          session_id: getSessionId(),
        }),
      });
    } catch (err) {
      console.error("Analytics failed:", err);
    }
  }, []);

  return { track };
};

// Component-level tracking for page views and time on page
export const useAutoTrack = (sectionName: string) => {
  const { track } = useAnalytics();
  const startTime = useRef(Date.now());

  useEffect(() => {
    // 1. Initial View Tracking
    track("section_view", sectionName);

    // 2. Time on Page Beacon (every 30s)
    const interval = setInterval(() => {
      const secondsSpent = Math.floor((Date.now() - startTime.current) / 1000);
      track("time_on_page", sectionName, { total_seconds: secondsSpent });
    }, 30000);

    return () => {
      clearInterval(interval);
      const finalSeconds = Math.floor((Date.now() - startTime.current) / 1000);
      track("time_on_page_final", sectionName, { total_seconds: finalSeconds });
    };
  }, [sectionName, track]);
};
