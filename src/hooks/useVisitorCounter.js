import { useState, useEffect } from 'react';
import { loadDatabase } from '../config/firebase';

const BASE_COUNT = 3450;

/** Counts one visit per browser per day; true when this page view should increment. */
const shouldCountVisit = () => {
  try {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('portfolio_last_visit');
    const sessionId = localStorage.getItem('portfolio_session_id');
    if (sessionId && lastVisit === today) return { increment: false, isNew: false };
    localStorage.setItem('portfolio_last_visit', today);
    localStorage.setItem('portfolio_session_id', Date.now().toString());
    return { increment: true, isNew: !sessionId || !lastVisit };
  } catch {
    return { increment: false, isNew: false };
  }
};

// Decide once per page load (StrictMode runs effects twice in development).
let visitDecision = null;
const getVisitDecision = () => visitDecision || (visitDecision = shouldCountVisit());

const fallbackCount = (increment) => {
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  return BASE_COUNT + Math.floor((daysSinceEpoch - 19700) * 2.5) + (increment ? 1 : 0);
};

// Defer non-critical work until the browser is idle (or 2s, whichever first).
const whenIdle = (fn) => {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(fn, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 1200);
  return () => clearTimeout(id);
};

const useVisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(BASE_COUNT);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewVisitor, setIsNewVisitor] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = null;
    const { increment, isNew } = getVisitDecision();
    setIsNewVisitor(isNew);

    const applyFallback = () => {
      if (cancelled) return;
      setVisitorCount(fallbackCount(increment));
      setIsLoading(false);
    };

    const cancelIdle = whenIdle(async () => {
      try {
        const { database, ref, onValue, runTransaction } = await loadDatabase();
        if (cancelled) return;
        const visitorRef = ref(database, 'visitorCount');
        unsubscribe = onValue(
          visitorRef,
          (snapshot) => {
            if (cancelled) return;
            setVisitorCount(snapshot.val() || BASE_COUNT);
            setIsLoading(false);
          },
          applyFallback
        );
        if (increment) {
          runTransaction(visitorRef, (current) => (current === null ? BASE_COUNT + 1 : current + 1)).catch(() => {});
        }
      } catch {
        applyFallback();
      }
    });

    return () => {
      cancelled = true;
      cancelIdle();
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const formatted = typeof visitorCount === 'number' && !Number.isNaN(visitorCount)
    ? visitorCount.toLocaleString()
    : BASE_COUNT.toLocaleString();

  return {
    visitorCount: formatted,
    rawCount: visitorCount,
    isLoading,
    isNewVisitor,
    message: isNewVisitor ? `Welcome! You're visitor #${formatted}` : `Total visitors: ${formatted}`,
  };
};

export default useVisitorCounter;
