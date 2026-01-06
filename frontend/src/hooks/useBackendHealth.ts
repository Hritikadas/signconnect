import { useState, useEffect, useCallback } from 'react';

interface HealthStatus {
  status: 'operational' | 'error' | 'checking';
  latency: string;
  lastCheck: Date | null;
  uptime: string;
}

export const useBackendHealth = (url: string = 'http://localhost:5000/health', interval: number = 30000) => {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'checking',
    latency: '0ms',
    lastCheck: null,
    uptime: '0%'
  });

  const checkHealth = useCallback(async () => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000)
      });

      const endTime = Date.now();
      const latency = endTime - startTime;

      if (response.ok) {
        setHealth(prev => ({
          status: 'operational' as const,
          latency: `${latency}ms`,
          lastCheck: new Date(),
          uptime: calculateUptime(prev.lastCheck, true)
        }));
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('Backend health check failed:', error);
      setHealth(prev => ({
        status: 'error' as const,
        latency: '0ms',
        lastCheck: new Date(),
        uptime: calculateUptime(prev.lastCheck, false)
      }));
    }
  }, [url]);

  const calculateUptime = (lastCheck: Date | null, isHealthy: boolean): string => {
    // Simple uptime calculation - in a real app, you'd track this more accurately
    if (!lastCheck) return isHealthy ? '100%' : '0%';
    
    // For demo purposes, simulate uptime based on current status
    const baseUptime = isHealthy ? 99.8 : 95.2;
    const variance = (Math.random() - 0.5) * 0.4; // ±0.2% variance
    return `${Math.max(0, Math.min(100, baseUptime + variance)).toFixed(1)}%`;
  };

  useEffect(() => {
    // Initial check
    checkHealth();

    // Set up interval for periodic checks
    const healthInterval = setInterval(checkHealth, interval);

    return () => clearInterval(healthInterval);
  }, [checkHealth, interval]);

  return { health, checkHealth };
};