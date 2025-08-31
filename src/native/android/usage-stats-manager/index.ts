import { NativeModules } from 'react-native';

const { UsageStats } = NativeModules;

export interface UsageStat {
  packageName: string;
  lastTimeUsed: number;
  totalTimeForeground: number;
  timeInMinutes?: number;
  isCurrentApp?: boolean;
}

export interface CurrentAppUsage {
  packageName: string;
  lastTimeUsed: number;
  totalTimeForeground: number;
  isCurrentApp: boolean;
}

async function fetchUsage(): Promise<UsageStat[]> {
  try {
    const hasPermission = await UsageStats.hasPermission();

    if(!hasPermission) {
      UsageStats.openUsageAccessSettings();
      return [];
    }

    const stats = await UsageStats.getUsageStats();
    return stats;
  } catch (error) {
    throw new Error('Failed to fetch usage statistics');
  }
}

async function getCurrentAppUsage(): Promise<CurrentAppUsage | null> {
  try {
    const hasPermission = await UsageStats.hasPermission();

    if(!hasPermission) {
      UsageStats.openUsageAccessSettings();
      return null;
    }

    const currentApp = await UsageStats.getCurrentAppUsage();
    return currentApp;
  } catch (error) {
    throw new Error('Failed to get current app usage');
  }
}

async function getUsageForInterval(intervalMinutes: number): Promise<UsageStat[]> {
  try {
    const hasPermission = await UsageStats.hasPermission();

    if(!hasPermission) {
      UsageStats.openUsageAccessSettings();
      return [];
    }

    const stats = await UsageStats.getUsageForInterval(intervalMinutes);
    return stats;
  } catch (error) {
    throw new Error('Failed to fetch usage for interval');
  }
}

async function isAppInForeground(packageName: string): Promise<boolean> {
  try {
    const hasPermission = await UsageStats.hasPermission();

    if(!hasPermission) {
      return false;
    }

    const isInForeground = await UsageStats.isAppInForeground(packageName);
    return isInForeground;
  } catch (error) {
    return false;
  }
}

async function getTopApps(limit: number = 10): Promise<UsageStat[]> {
  try {
    const hasPermission = await UsageStats.hasPermission();

    if(!hasPermission) {
      UsageStats.openUsageAccessSettings();
      return [];
    }

    const topApps = await UsageStats.getTopApps(limit);
    return topApps;
  } catch (error) {
    throw new Error('Failed to fetch top apps');
  }
}

async function hasPermission(): Promise<boolean> {
  try {
    return await UsageStats.hasPermission();
  } catch (error) {
    return false;
  }
}

function openUsageAccessSettings(): void {
  UsageStats.openUsageAccessSettings();
}

export {
  fetchUsage,
  getCurrentAppUsage,
  getUsageForInterval,
  isAppInForeground,
  getTopApps,
  hasPermission,
  openUsageAccessSettings,
};

export default fetchUsage;