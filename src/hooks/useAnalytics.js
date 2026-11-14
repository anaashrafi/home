import { useEffect, useCallback, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

// Initialize Google Analytics (call this once in your app)
let gaInitialized = false;
export const initializeGA = (measurementId) => {
  if (measurementId && !gaInitialized) {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
    });
    gaInitialized = true;
    console.log('Google Analytics initialized with ID:', measurementId);
  }
};

/**
 * Modern analytics hook with privacy-first approach
 * Integrates with Google Analytics 4
 * @param {object} options - Configuration options
 * @returns {object} Analytics utilities
 */
export const useAnalytics = (options = {}) => {
  const {
    enableTracking = true,
    respectDoNotTrack = true,
    sessionTimeout = 30 * 60 * 1000, // 30 minutes
    batchSize = 10,
    flushInterval = 5000, // 5 seconds
    enableGA = true, // Enable Google Analytics integration
  } = options;

  const location = useLocation();
  const sessionId = useRef(generateSessionId());
  const eventQueue = useRef([]);
  const lastActivity = useRef(Date.now());
  const flushTimer = useRef(null);

  // Check if tracking is allowed
  const isTrackingAllowed = useCallback(() => {
    if (!enableTracking) return false;
    if (respectDoNotTrack && navigator.doNotTrack === '1') return false;
    if (localStorage.getItem('analytics-opt-out') === 'true') return false;
    return true;
  }, [enableTracking, respectDoNotTrack]);

  // Generate unique session ID
  function generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get user agent info
  const getUserAgentInfo = useCallback(() => {
    const ua = navigator.userAgent;
    return {
      browser: getBrowserName(ua),
      os: getOSName(ua),
      device: getDeviceType(ua),
      isMobile: /Mobile|Android|iPhone|iPad/.test(ua),
    };
  }, []);

  // Simple browser detection
  function getBrowserName(ua) {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  // Simple OS detection
  function getOSName(ua) {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  // Simple device type detection
  function getDeviceType(ua) {
    if (/Mobile|Android|iPhone/.test(ua)) return 'mobile';
    if (/iPad|Tablet/.test(ua)) return 'tablet';
    return 'desktop';
  }

  // Get page performance metrics
  const getPerformanceMetrics = useCallback(() => {
    if (!window.performance) return {};

    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    return {
      loadTime: navigation?.loadEventEnd - navigation?.loadEventStart,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      memoryUsage: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null,
    };
  }, []);

  // Add event to queue
  const queueEvent = useCallback((eventData) => {
    if (!isTrackingAllowed()) return;

    const event = {
      ...eventData,
      sessionId: sessionId.current,
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: getUserAgentInfo(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
    };

    eventQueue.current.push(event);
    lastActivity.current = Date.now();

    // Flush if batch size reached
    if (eventQueue.current.length >= batchSize) {
      flushEvents();
    }
  }, [isTrackingAllowed, getUserAgentInfo, batchSize]);

  // Flush events to server
  const flushEvents = useCallback(async () => {
    if (eventQueue.current.length === 0) return;

    const events = [...eventQueue.current];
    eventQueue.current = [];

    try {
      // Analytics disabled - events are logged to console only
      console.log('Analytics events (not sent to server):', events);
      // await analyticsAPI.post('/events', { events });
    } catch (error) {
      console.warn('Failed to send analytics events:', error);
      // Re-queue events on failure (with limit to prevent infinite growth)
      if (eventQueue.current.length < 100) {
        eventQueue.current.unshift(...events);
      }
    }
  }, []);

  // Track page view
  const trackPageView = useCallback((customData = {}) => {
    const pageData = {
      type: 'page_view',
      page: location.pathname,
      title: document.title,
      performance: getPerformanceMetrics(),
      ...customData,
    };
    
    queueEvent(pageData);
    
    // Send to Google Analytics
    if (enableGA && gaInitialized && isTrackingAllowed()) {
      ReactGA.send({ 
        hitType: "pageview", 
        page: location.pathname,
        title: document.title 
      });
    }
  }, [location.pathname, queueEvent, getPerformanceMetrics, enableGA, isTrackingAllowed]);

  // Track custom event
  const trackEvent = useCallback((eventName, properties = {}) => {
    queueEvent({
      type: 'custom_event',
      name: eventName,
      properties,
    });
    
    // Send to Google Analytics
    if (enableGA && gaInitialized && isTrackingAllowed()) {
      ReactGA.event({
        category: properties.category || 'User',
        action: eventName,
        label: properties.label || '',
        value: properties.value || 0,
      });
    }
  }, [queueEvent, enableGA, isTrackingAllowed]);

  // Track user interaction
  const trackInteraction = useCallback((element, action, properties = {}) => {
    queueEvent({
      type: 'interaction',
      element,
      action,
      properties,
    });
  }, [queueEvent]);

  // Track error
  const trackError = useCallback((error, context = {}) => {
    queueEvent({
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
    });
  }, [queueEvent]);

  // Track timing
  const trackTiming = useCallback((category, variable, time, label = '') => {
    queueEvent({
      type: 'timing',
      category,
      variable,
      time,
      label,
    });
  }, [queueEvent]);

  // Track conversion
  const trackConversion = useCallback((goal, value = 0, properties = {}) => {
    queueEvent({
      type: 'conversion',
      goal,
      value,
      properties,
    });
  }, [queueEvent]);

  // Start timing
  const startTiming = useCallback((name) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      trackTiming('user_timing', name, endTime - startTime);
    };
  }, [trackTiming]);

  // Opt out of tracking
  const optOut = useCallback(() => {
    localStorage.setItem('analytics-opt-out', 'true');
    eventQueue.current = [];
  }, []);

  // Opt in to tracking
  const optIn = useCallback(() => {
    localStorage.removeItem('analytics-opt-out');
  }, []);

  // Check session timeout
  useEffect(() => {
    const checkSession = () => {
      if (Date.now() - lastActivity.current > sessionTimeout) {
        sessionId.current = generateSessionId();
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [sessionTimeout]);

  // Set up flush timer
  useEffect(() => {
    flushTimer.current = setInterval(flushEvents, flushInterval);
    return () => {
      if (flushTimer.current) {
        clearInterval(flushTimer.current);
      }
    };
  }, [flushEvents, flushInterval]);

  // Track page views on route change
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  // Flush events on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      flushEvents();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushEvents();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      flushEvents(); // Final flush on unmount
    };
  }, [flushEvents]);

  return {
    // Tracking methods
    trackPageView,
    trackEvent,
    trackInteraction,
    trackError,
    trackTiming,
    trackConversion,
    startTiming,

    // Utilities
    flushEvents,
    optOut,
    optIn,
    isTrackingAllowed: isTrackingAllowed(),
    sessionId: sessionId.current,
  };
};

/**
 * Hook for tracking component performance
 * @param {string} componentName - Name of the component
 * @returns {object} Performance tracking utilities
 */
export const useComponentAnalytics = (componentName) => {
  const { trackTiming, trackError } = useAnalytics();
  const mountTime = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    
    // Track mount time on first render
    if (renderCount.current === 1) {
      const mountDuration = performance.now() - mountTime.current;
      trackTiming('component_performance', `${componentName}_mount`, mountDuration);
    }

    return () => {
      // Track unmount on cleanup
      if (renderCount.current === 1) {
        const totalLifetime = performance.now() - mountTime.current;
        trackTiming('component_performance', `${componentName}_lifetime`, totalLifetime);
      }
    };
  });

  const trackComponentError = useCallback((error) => {
    trackError(error, { component: componentName, renderCount: renderCount.current });
  }, [trackError, componentName]);

  const trackComponentEvent = useCallback((eventName, properties = {}) => {
    trackTiming('component_event', eventName, performance.now(), JSON.stringify({
      component: componentName,
      renderCount: renderCount.current,
      ...properties,
    }));
  }, [trackTiming, componentName]);

  return {
    trackComponentError,
    trackComponentEvent,
    renderCount: renderCount.current,
  };
};

/**
 * Hook for A/B testing
 * @param {string} testName - Name of the test
 * @param {array} variants - Array of variant names
 * @param {object} options - Configuration options
 * @returns {object} A/B test utilities
 */
export const useABTest = (testName, variants, options = {}) => {
  const { trackEvent } = useAnalytics();
  const { persistVariant = true } = options;
  
  const getVariant = useCallback(() => {
    if (persistVariant) {
      const saved = localStorage.getItem(`ab_test_${testName}`);
      if (saved && variants.includes(saved)) {
        return saved;
      }
    }

    // Assign random variant
    const variant = variants[Math.floor(Math.random() * variants.length)];
    
    if (persistVariant) {
      localStorage.setItem(`ab_test_${testName}`, variant);
    }

    // Track assignment
    trackEvent('ab_test_assigned', {
      testName,
      variant,
    });

    return variant;
  }, [testName, variants, persistVariant, trackEvent]);

  const [variant] = useState(getVariant);

  const trackConversion = useCallback((goal, value = 1) => {
    trackEvent('ab_test_conversion', {
      testName,
      variant,
      goal,
      value,
    });
  }, [trackEvent, testName, variant]);

  return {
    variant,
    trackConversion,
    isVariant: (variantName) => variant === variantName,
  };
};