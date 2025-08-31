import { storageService } from '../storage';
import { fetchUsage } from 'native/android';

export class BlockingService {
  private static instance: BlockingService;
  private checkInterval: NodeJS.Timeout | null = null;

  static getInstance(): BlockingService {
    if (!BlockingService.instance) {
      BlockingService.instance = new BlockingService();
    }
    return BlockingService.instance;
  }

  async shouldBlock(): Promise<boolean> {
    try {
      const settings = await storageService.getBlockingSettings();
      
      if (!settings.isEnabled) {
        return false;
      }

      // If there's no last block time, check current usage
      if (!settings.lastBlockTime) {
        return await this.checkCurrentUsage(settings.intervalMinutes);
      }

      // Check if enough time has passed since last block
      const timeSinceLastBlock = Date.now() - settings.lastBlockTime;
      const intervalMs = settings.intervalMinutes * 60 * 1000;
      
      if (timeSinceLastBlock >= intervalMs) {
        return await this.checkCurrentUsage(settings.intervalMinutes);
      }

      return false;
    } catch (error) {
      console.error('Error checking if should block:', error);
      return false;
    }
  }

  private async checkCurrentUsage(intervalMinutes: number): Promise<boolean> {
    try {
      // For now, we'll use a simple time-based check
      // In a real implementation, this would check actual device usage
      const currentTime = Date.now();
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      // Simulate usage check - in reality this would use native APIs
      const simulatedUsage = currentTime - startOfDay.getTime();
      const maxUsage = intervalMinutes * 60 * 1000;
      
      return simulatedUsage > maxUsage;
    } catch (error) {
      console.error('Error checking current usage:', error);
      return false;
    }
  }

  async triggerBlock(): Promise<void> {
    try {
      await storageService.updateBlockingSettings({
        lastBlockTime: Date.now(),
      });
    } catch (error) {
      console.error('Error triggering block:', error);
    }
  }

  async resetBlock(): Promise<void> {
    try {
      await storageService.updateBlockingSettings({
        lastBlockTime: null,
      });
    } catch (error) {
      console.error('Error resetting block:', error);
    }
  }

  startMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Check every 30 seconds
    this.checkInterval = setInterval(async () => {
      const shouldBlock = await this.shouldBlock();
      if (shouldBlock) {
        // In a real app, this would trigger the block screen
        console.log('Blocking should be triggered');
        await this.triggerBlock();
      }
    }, 30000);
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // For testing purposes
  async simulateBlock(): Promise<void> {
    await this.triggerBlock();
  }
}

export const blockingService = BlockingService.getInstance();
