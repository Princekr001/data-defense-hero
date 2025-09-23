import { createContext, useContext, useEffect, ReactNode } from 'react';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  page: (name: string, properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  track: () => {},
  identify: () => {},
  page: () => {},
});

export const useAnalytics = () => useContext(AnalyticsContext);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Simple analytics implementation - replace with your analytics service
  const track = (event: string, properties: Record<string, any> = {}) => {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: getSessionId(),
      },
      timestamp: Date.now(),
    };

    // Store locally for demo purposes - replace with actual analytics service
    const events = getStoredEvents();
    events.push(analyticsEvent);
    localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100))); // Keep last 100 events

    // Console log for development
    console.log('Analytics Event:', analyticsEvent);
  };

  const identify = (userId: string, traits: Record<string, any> = {}) => {
    const userProfile = {
      userId,
      traits: {
        ...traits,
        lastSeen: Date.now(),
      },
    };

    localStorage.setItem('analytics_user', JSON.stringify(userProfile));
    console.log('User Identified:', userProfile);
  };

  const page = (name: string, properties: Record<string, any> = {}) => {
    track('page_view', {
      page: name,
      ...properties,
    });
  };

  // Track page load
  useEffect(() => {
    page('Game Home', {
      referrer: document.referrer,
      title: document.title,
    });
  }, []);

  // Track session start
  useEffect(() => {
    track('session_start', {
      sessionId: getSessionId(),
      deviceType: getDeviceType(),
      screenSize: `${window.screen.width}x${window.screen.height}`,
    });

    // Track session end on beforeunload
    const handleSessionEnd = () => {
      track('session_end', {
        sessionId: getSessionId(),
        sessionDuration: getSessionDuration(),
      });
    };

    window.addEventListener('beforeunload', handleSessionEnd);
    return () => window.removeEventListener('beforeunload', handleSessionEnd);
  }, []);

  return (
    <AnalyticsContext.Provider value={{ track, identify, page }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Utility functions
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
    sessionStorage.setItem('session_start_time', Date.now().toString());
  }
  return sessionId;
}

function getSessionDuration(): number {
  const startTime = sessionStorage.getItem('session_start_time');
  if (startTime) {
    return Date.now() - parseInt(startTime);
  }
  return 0;
}

function getDeviceType(): string {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function getStoredEvents(): AnalyticsEvent[] {
  try {
    const events = localStorage.getItem('analytics_events');
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error('Error parsing stored analytics events:', error);
    return [];
  }
}