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
  getAppUsage(start: number, end: number): Promise<UsageStatsType | null> {
    return UsageStatsModule.getAppUsage(start, end);
  },
  getUsageEvents(start: number, end: number): Promise<UsageStatsEventType[]> {
    return UsageStatsModule.getUsageEvents(start, end);
  },
};
