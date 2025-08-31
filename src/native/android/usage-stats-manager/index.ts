import { NativeModules } from 'react-native';

const { UsageStats } = NativeModules;

async function fetchUsage() {
  try {
    const hasPermission = await UsageStats.hasPermission();

    if(!hasPermission) {
      UsageStats.openUsageAccessSettings();
      return { error: 'Permission not granted' };
    }

    const stats = await UsageStats.getUsageStats();
    console.log('Usage Stats received:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    throw error;
  }
}

export default fetchUsage;