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

export interface BlockingResult {
  shouldBlock: boolean;
  totalUsageTime: number;
  maxAllowedTime: number;
  usagePercentage: number;
}

export interface UsageTimeResult {
  totalUsageTime: number;
  usageTimeMinutes: number;
  intervalMinutes: number;
  remainingMinutes: number;
}

export interface UsageBreakdown {
  apps: Array<{
    packageName: string;
    totalTimeForeground: number;
    timeInMinutes: number;
    lastTimeUsed: number;
  }>;
  totalUsageTime: number;
  totalUsageMinutes: number;
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

// New blocking methods
async function shouldBlockDevice(intervalMinutes: number): Promise<BlockingResult> {
  try {
    const hasPermission = await UsageStats.hasPermission();

    if(!hasPermission) {
      UsageStats.openUsageAccessSettings();
      return {
        shouldBlock: false,
        totalUsageTime: 0,
        maxAllowedTime: intervalMinutes * 60 * 1000,
        usagePercentage: 0,
      };
    }

    const result = await UsageStats.shouldBlockDevice(intervalMinutes);
    return result;
  } catch (error) {
    throw new Error('Failed to check if device should be blocked');
  }
}

async function getCurrentUsageTime(intervalMinutes: number): Promise<UsageTimeResult> {
  try {
    const hasPermission = await UsageStats.hasPermission();

    if(!hasPermission) {
      UsageStats.openUsageAccessSettings();
      return {
        totalUsageTime: 0,
        usageTimeMinutes: 0,
        intervalMinutes,
        remainingMinutes: intervalMinutes,
      };
    }

    const result = await UsageStats.getCurrentUsageTime(intervalMinutes);
    return result;
  } catch (error) {
    throw new Error('Failed to get current usage time');
  }
}

async function getDetailedUsageBreakdown(intervalMinutes: number): Promise<UsageBreakdown> {
  try {
    const hasPermission = await UsageStats.hasPermission();

    if(!hasPermission) {
      UsageStats.openUsageAccessSettings();
      return {
        apps: [],
        totalUsageTime: 0,
        totalUsageMinutes: 0,
      };
    }

    const result = await UsageStats.getDetailedUsageBreakdown(intervalMinutes);
    return result;
  } catch (error) {
    throw new Error('Failed to get detailed usage breakdown');
  }
}

// Background monitoring methods
async function startBackgroundMonitoring(intervalMinutes: number, checkIntervalSeconds: number = 30): Promise<boolean> {
  try {
    const hasPermission = await UsageStats.hasPermission();

    if(!hasPermission) {
      UsageStats.openUsageAccessSettings();
      return false;
    }

    const result = await UsageStats.startBackgroundMonitoring(intervalMinutes, checkIntervalSeconds);
    return result;
  } catch (error) {
    throw new Error('Failed to start background monitoring');
  }
}

async function stopBackgroundMonitoring(): Promise<boolean> {
  try {
    const result = await UsageStats.stopBackgroundMonitoring();
    return result;
  } catch (error) {
    throw new Error('Failed to stop background monitoring');
  }
}

async function isBackgroundMonitoringActive(): Promise<boolean> {
  try {
    const result = await UsageStats.isBackgroundMonitoringActive();
    return result;
  } catch (error) {
    return false;
  }
}

export {
  fetchUsage,
  getCurrentAppUsage,
  getUsageForInterval,
  isAppInForeground,
  getTopApps,
  hasPermission,
  openUsageAccessSettings,
  shouldBlockDevice,
  getCurrentUsageTime,
  getDetailedUsageBreakdown,
  startBackgroundMonitoring,
  stopBackgroundMonitoring,
  isBackgroundMonitoringActive,
};

export default fetchUsage;