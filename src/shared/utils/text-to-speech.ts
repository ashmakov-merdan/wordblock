import Tts from 'react-native-tts';

interface TextToSpeechInterface {
  speak(text: string): Promise<void>;
  stop(): Promise<void>;
  isAvailable(): Promise<boolean>;
  onStateChange?: (isSpeaking: boolean) => void;
}

class TextToSpeechService implements TextToSpeechInterface {
  private isSpeaking = false;
  private isInitialized = false;
  private stateChangeCallbacks: ((isSpeaking: boolean) => void)[] = [];

  constructor() {
    // Delay initialization to ensure the app is fully loaded
    setTimeout(() => {
      this.initializeTts();
    }, 1000);
  }

  // Add callback for state changes
  addStateChangeCallback(callback: (isSpeaking: boolean) => void): void {
    this.stateChangeCallbacks.push(callback);
  }

  // Remove callback
  removeStateChangeCallback(callback: (isSpeaking: boolean) => void): void {
    const index = this.stateChangeCallbacks.indexOf(callback);
    if (index > -1) {
      this.stateChangeCallbacks.splice(index, 1);
    }
  }

  // Notify all callbacks of state change
  private notifyStateChange(isSpeaking: boolean): void {
    this.stateChangeCallbacks.forEach(callback => {
      try {
        callback(isSpeaking);
      } catch (error) {
        console.error('Error in TTS state change callback:', error);
      }
    });
  }

  private async initializeTts(): Promise<void> {
    try {
      // Check if TTS is available first
      const available = await this.isAvailable();
      if (!available) {
        console.warn('TTS is not available on this device');
        this.isInitialized = true;
        return;
      }

      // Set up event listeners first
      Tts.addEventListener('tts-start', () => {
        this.isSpeaking = true;
        this.notifyStateChange(true);
        
        setTimeout(() => {
          if (this.isSpeaking) {
            this.isSpeaking = false;
            this.notifyStateChange(false);
          }
        }, 10000);
      });
      
      Tts.addEventListener('tts-finish', () => {
        this.isSpeaking = false;
        this.notifyStateChange(false);
      });
      
      Tts.addEventListener('tts-cancel', () => {
        this.isSpeaking = false;
        this.notifyStateChange(false);
      });
      
      Tts.addEventListener('tts-error', () => {
        this.isSpeaking = false;
        this.notifyStateChange(false);
      });

      try {
        await Tts.setDefaultLanguage('en-US');
      } catch (error) {
        console.warn('Could not set default language:', error);
      }

      try {
        await Tts.setDefaultRate(0.5);
      } catch (error) {
        try {
          await Tts.setDefaultRate(50);
        } catch (rateError) {
          console.warn('Could not set default rate:', rateError);
        }
      }

      try {
        await Tts.setDefaultPitch(1.0);
      } catch (error) {
        try {
          await Tts.setDefaultPitch(100);
        } catch (pitchError) {
          console.warn('Could not set default pitch:', pitchError);
        }
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing TTS:', error);
      this.isInitialized = true;
    }
  }

  async speak(text: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeTts();
    }

    if (this.isSpeaking) {
      await this.stop();
    }

    try {
      Tts.speak(text);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      this.isSpeaking = false;
      this.notifyStateChange(false);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await Tts.stop();
      this.isSpeaking = false;
      this.notifyStateChange(false);
    } catch (error) {
      console.error('Error stopping speech:', error);
      this.isSpeaking = false;
      this.notifyStateChange(false);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const engines = await Tts.engines();
      return engines.length > 0;
    } catch (error) {
      console.error('Error checking TTS availability:', error);
      return false;
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  // Manual reset method in case state gets stuck
  resetState(): void {
    console.log('Manually resetting TTS state');
    this.isSpeaking = false;
    this.notifyStateChange(false);
  }
}

export default new TextToSpeechService();
