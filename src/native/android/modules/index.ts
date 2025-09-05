import { NativeModules } from 'react-native';
import { UsageStatsEventType, UsageStatsType } from '../types';

const { UsageStatsModule } = NativeModules;

export default {
  hasUsagePermission(): Promise<boolean> {
    return UsageStatsModule.hasUsagePermission();
  },
  openUsageAccessSettings(): Promise<void> {
    return UsageStatsModule.openUsageAccessSettings();
  },
  getAppUsage(): Promise<UsageStatsType | null> {
    return UsageStatsModule.getAppUsage();
  },
  getUsageEvents(start: number, end: number): Promise<UsageStatsEventType[]> {
    return UsageStatsModule.getUsageEvents(start, end);
  },
  async setBlocking(enabled: boolean): Promise<void> {
    try {
      await UsageStatsModule.setBlocking(enabled);
    } catch (error) {
      console.log('Failed to block device', error);
    }
  },
  async isPinned(): Promise<boolean> {
    const isPinned = await UsageStatsModule.isPinned();
    return isPinned;
  }
};
