import { storageService } from '../storage';
import { 
  shouldBlockDevice, 
  getCurrentUsageTime, 
  getDetailedUsageBreakdown,
  startBackgroundMonitoring,
  stopBackgroundMonitoring,
  isBackgroundMonitoringActive,
  hasPermission
} from 'native/android/usage-stats-manager';
import { Platform } from 'react-native';

export interface BlockingStatus {
  shouldBlock: boolean;
  totalUsageTime: number;
  maxAllowedTime: number;
  usagePercentage: number;
  remainingMinutes: number;
}

export class BlockingService {
  private static instance: BlockingService;
  private checkInterval: ReturnType<typeof setInterval> | null = null;
  private isMonitoring: boolean = false;

  static getInstance(): BlockingService {
    if (!BlockingService.instance) {
      BlockingService.instance = new BlockingService();
    }
    return BlockingService.instance;
  }

  async shouldBlock(): Promise<BlockingStatus> {
    try {
      const settings = await storageService.getBlockingSettings();
      
      if (!settings.isEnabled) {
        return {
          shouldBlock: false,
          totalUsageTime: 0,
          maxAllowedTime: settings.intervalMinutes * 60 * 1000,
          usagePercentage: 0,
          remainingMinutes: settings.intervalMinutes,
        };
      }

      // Use Android native method for real usage checking
      if (Platform.OS === 'android') {
        const hasUsagePermission = await hasPermission();
        if (!hasUsagePermission) {
          console.warn('Usage stats permission not granted');
          return {
            shouldBlock: false,
            totalUsageTime: 0,
            maxAllowedTime: settings.intervalMinutes * 60 * 1000,
            usagePercentage: 0,
            remainingMinutes: settings.intervalMinutes,
          };
        }

        const blockingResult = await shouldBlockDevice(settings.intervalMinutes);
        const usageTime = await getCurrentUsageTime(settings.intervalMinutes);
        
        return {
          shouldBlock: blockingResult.shouldBlock,
          totalUsageTime: blockingResult.totalUsageTime,
          maxAllowedTime: blockingResult.maxAllowedTime,
          usagePercentage: blockingResult.usagePercentage,
          remainingMinutes: usageTime.remainingMinutes,
        };
      }

      // Fallback for iOS or when Android native methods fail
      return await this.fallbackUsageCheck(settings.intervalMinutes);
    } catch (error) {
      console.error('Error checking if should block:', error);
      return await this.fallbackUsageCheck(30); // Default 30 minutes
    }
  }

  private async fallbackUsageCheck(intervalMinutes: number): Promise<BlockingStatus> {
    try {
      const settings = await storageService.getBlockingSettings();
      
      // If there's no last block time, check current usage
      if (!settings.lastBlockTime) {
        const currentTime = Date.now();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        // Simulate usage check - in reality this would use native APIs
        const simulatedUsage = currentTime - startOfDay.getTime();
        const maxUsage = intervalMinutes * 60 * 1000;
        
        return {
          shouldBlock: simulatedUsage > maxUsage,
          totalUsageTime: simulatedUsage,
          maxAllowedTime: maxUsage,
          usagePercentage: (simulatedUsage / maxUsage) * 100,
          remainingMinutes: Math.max(0, intervalMinutes - (simulatedUsage / (1000 * 60))),
        };
      }

      // Check if enough time has passed since last block
      const timeSinceLastBlock = Date.now() - settings.lastBlockTime;
      const intervalMs = settings.intervalMinutes * 60 * 1000;
      
      if (timeSinceLastBlock >= intervalMs) {
        return await this.fallbackUsageCheck(settings.intervalMinutes);
      }

      return {
        shouldBlock: false,
        totalUsageTime: 0,
        maxAllowedTime: intervalMs,
        usagePercentage: 0,
        remainingMinutes: intervalMinutes,
      };
    } catch (error) {
      console.error('Error in fallback usage check:', error);
      return {
        shouldBlock: false,
        totalUsageTime: 0,
        maxAllowedTime: intervalMinutes * 60 * 1000,
        usagePercentage: 0,
        remainingMinutes: intervalMinutes,
      };
    }
  }

  async getCurrentUsageBreakdown(intervalMinutes: number) {
    try {
      if (Platform.OS === 'android') {
        const hasUsagePermission = await hasPermission();
        if (hasUsagePermission) {
          return await getDetailedUsageBreakdown(intervalMinutes);
        }
      }
      
      // Fallback: return empty breakdown
      return {
        apps: [],
        totalUsageTime: 0,
        totalUsageMinutes: 0,
      };
    } catch (error) {
      console.error('Error getting usage breakdown:', error);
      return {
        apps: [],
        totalUsageTime: 0,
        totalUsageMinutes: 0,
      };
    }
  }

  async triggerBlock(): Promise<void> {
    try {
      await storageService.updateBlockingSettings({
        lastBlockTime: Date.now(),
      });
      
      // Increment block count
      await storageService.incrementBlockCount();
      
      console.log('Block triggered at:', new Date().toISOString());
    } catch (error) {
      console.error('Error triggering block:', error);
    }
  }

  async resetBlock(): Promise<void> {
    try {
      await storageService.updateBlockingSettings({
        lastBlockTime: undefined,
      });
      console.log('Block reset at:', new Date().toISOString());
    } catch (error) {
      console.error('Error resetting block:', error);
    }
  }

  async startBackgroundMonitoring(): Promise<boolean> {
    try {
      const settings = await storageService.getBlockingSettings();
      
      if (!settings.isEnabled) {
        console.log('Blocking is disabled, not starting background monitoring');
        return false;
      }

      if (Platform.OS === 'android') {
        const hasUsagePermission = await hasPermission();
        if (!hasUsagePermission) {
          console.warn('Cannot start background monitoring without usage stats permission');
          return false;
        }

        const success = await startBackgroundMonitoring(settings.intervalMinutes, 30);
        if (success) {
          this.isMonitoring = true;
          console.log('Background monitoring started successfully');
        }
        return success;
      }

      // For iOS or fallback, use JavaScript-based monitoring
      this.startJavaScriptMonitoring();
      return true;
    } catch (error) {
      console.error('Error starting background monitoring:', error);
      return false;
    }
  }

  async stopBackgroundMonitoring(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const success = await stopBackgroundMonitoring();
        if (success) {
          this.isMonitoring = false;
          console.log('Background monitoring stopped successfully');
        }
        return success;
      }

      // Stop JavaScript-based monitoring
      this.stopJavaScriptMonitoring();
      return true;
    } catch (error) {
      console.error('Error stopping background monitoring:', error);
      return false;
    }
  }

  async isBackgroundMonitoringActive(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        return await isBackgroundMonitoringActive();
      }
      return this.isMonitoring;
    } catch (error) {
      console.error('Error checking background monitoring status:', error);
      return false;
    }
  }

  private startJavaScriptMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Check every 30 seconds
    this.checkInterval = setInterval(async () => {
      const blockingStatus = await this.shouldBlock();
      if (blockingStatus.shouldBlock) {
        console.log('JavaScript monitoring: Blocking should be triggered');
        await this.triggerBlock();
      }
    }, 30000);

    this.isMonitoring = true;
    console.log('JavaScript-based monitoring started');
  }

  private stopJavaScriptMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
    console.log('JavaScript-based monitoring stopped');
  }

  // For testing purposes
  async simulateBlock(): Promise<void> {
    await this.triggerBlock();
  }

  async checkPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        return await hasPermission();
      }
      return true; // iOS permissions handled differently
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }
}

export const blockingService = BlockingService.getInstance();
