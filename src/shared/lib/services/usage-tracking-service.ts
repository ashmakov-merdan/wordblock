import { storageService } from '../storage';

export interface UsageSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number;
  screenName: string;
}

export interface DailyUsage {
  date: string; // YYYY-MM-DD format
  totalTime: number;
  sessions: number;
  screens: { [key: string]: number };
}

class UsageTrackingService {
  private static instance: UsageTrackingService;
  private currentSession: UsageSession | null = null;
  private appStartTime: number = Date.now();

  static getInstance(): UsageTrackingService {
    if (!UsageTrackingService.instance) {
      UsageTrackingService.instance = new UsageTrackingService();
    }
    return UsageTrackingService.instance;
  }

  startSession(screenName: string): void {
    if (this.currentSession) {
      this.endCurrentSession();
    }

    this.currentSession = {
      id: Date.now().toString(),
      startTime: Date.now(),
      duration: 0,
      screenName,
    };
  }

  endCurrentSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
      
      // Save session to storage
      this.saveSession(this.currentSession);
      this.currentSession = null;
    }
  }

  private async saveSession(session: UsageSession): Promise<void> {
    try {
      const sessions = await this.getSessions();
      sessions.push(session);
      
      // Keep only last 1000 sessions to prevent storage bloat
      if (sessions.length > 1000) {
        sessions.splice(0, sessions.length - 1000);
      }
      
      await storageService.setItem('usage_sessions', sessions);
    } catch (error) {
      console.error('Failed to save usage session:', error);
    }
  }

  async getSessions(): Promise<UsageSession[]> {
    try {
      return await storageService.getItem('usage_sessions', []);
    } catch (error) {
      console.error('Failed to get usage sessions:', error);
      return [];
    }
  }

  async getDailyUsage(days: number = 7): Promise<DailyUsage[]> {
    const sessions = await this.getSessions();
    const dailyUsage: { [key: string]: DailyUsage } = {};
    
    const now = new Date();
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.startTime);
      if (sessionDate >= startDate) {
        const dateKey = sessionDate.toISOString().split('T')[0];
        
        if (!dailyUsage[dateKey]) {
          dailyUsage[dateKey] = {
            date: dateKey,
            totalTime: 0,
            sessions: 0,
            screens: {},
          };
        }
        
        dailyUsage[dateKey].totalTime += session.duration;
        dailyUsage[dateKey].sessions += 1;
        dailyUsage[dateKey].screens[session.screenName] = 
          (dailyUsage[dateKey].screens[session.screenName] || 0) + session.duration;
      }
    });
    
    return Object.values(dailyUsage).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getTotalUsageTime(): Promise<number> {
    const sessions = await this.getSessions();
    return sessions.reduce((total, session) => total + session.duration, 0);
  }

  async getTodayUsageTime(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const dailyUsage = await this.getDailyUsage(1);
    const todayUsage = dailyUsage.find(usage => usage.date === today);
    return todayUsage ? todayUsage.totalTime : 0;
  }

  async getWeeklyUsageTime(): Promise<number> {
    const dailyUsage = await this.getDailyUsage(7);
    return dailyUsage.reduce((total, day) => total + day.totalTime, 0);
  }

  async getScreenUsageTime(screenName: string, days: number = 7): Promise<number> {
    const dailyUsage = await this.getDailyUsage(days);
    return dailyUsage.reduce((total, day) => {
      return total + (day.screens[screenName] || 0);
    }, 0);
  }

  async getMostUsedScreens(days: number = 7): Promise<{ screen: string; time: number }[]> {
    const dailyUsage = await this.getDailyUsage(days);
    const screenTotals: { [key: string]: number } = {};
    
    dailyUsage.forEach(day => {
      Object.entries(day.screens).forEach(([screen, time]) => {
        screenTotals[screen] = (screenTotals[screen] || 0) + time;
      });
    });
    
    return Object.entries(screenTotals)
      .map(([screen, time]) => ({ screen, time }))
      .sort((a, b) => b.time - a.time);
  }

  getAppUptime(): number {
    return Date.now() - this.appStartTime;
  }

  // Clean up old sessions (older than 30 days)
  async cleanupOldSessions(): Promise<void> {
    try {
      const sessions = await this.getSessions();
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const filteredSessions = sessions.filter(session => session.startTime > thirtyDaysAgo);
      
      if (filteredSessions.length !== sessions.length) {
        await storageService.setItem('usage_sessions', filteredSessions);
      }
    } catch (error) {
      console.error('Failed to cleanup old sessions:', error);
    }
  }
}

export const usageTrackingService = UsageTrackingService.getInstance();
