import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { blockingService } from './blocking-service';

export interface BlockEvent {
  timestamp: number;
  intervalMinutes: number;
}

class BlockingEventService {
  private static instance: BlockingEventService;
  private eventEmitter: NativeEventEmitter | null = null;
  private listeners: Array<(event: BlockEvent) => void> = [];

  static getInstance(): BlockingEventService {
    if (!BlockingEventService.instance) {
      BlockingEventService.instance = new BlockingEventService();
    }
    return BlockingEventService.instance;
  }

  initialize(): void {
    if (Platform.OS === 'android') {
      try {
        // Create event emitter for Android broadcast events
        this.eventEmitter = new NativeEventEmitter(NativeModules.UsageStats);
        
        // Listen for block triggered events
        this.eventEmitter.addListener('blockTriggered', (event: BlockEvent) => {
          console.log('Block event received:', event);
          this.handleBlockEvent(event);
        });

        console.log('Blocking event service initialized for Android');
      } catch (error) {
        console.error('Failed to initialize blocking event service:', error);
      }
    }
  }

  private handleBlockEvent(event: BlockEvent): void {
    // Trigger the block
    blockingService.triggerBlock();
    
    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in block event listener:', error);
      }
    });
  }

  addListener(listener: (event: BlockEvent) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (event: BlockEvent) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  cleanup(): void {
    if (this.eventEmitter) {
      this.eventEmitter.removeAllListeners('blockTriggered');
      this.eventEmitter = null;
    }
    this.listeners = [];
  }
}

export const blockingEventService = BlockingEventService.getInstance();
