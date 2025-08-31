import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { storageService } from 'shared/lib/storage';
import { usageTrackingService } from 'shared/lib/services';
import { theme } from 'shared/theme';

const BlockScreen = () => {
  const navigation = useNavigation();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [blockingSettings, setBlockingSettings] = useState<any>(null);

  useEffect(() => {
    loadBlockingSettings();
    startTimer();
    usageTrackingService.startSession('Block');
    
    return () => {
      usageTrackingService.endCurrentSession();
    };
  }, []);

  const loadBlockingSettings = async () => {
    try {
      const settings = await storageService.getBlockingSettings();
      setBlockingSettings(settings);
      
      // Calculate time remaining based on last block time
      if (settings.lastBlockTime) {
        const elapsed = Date.now() - settings.lastBlockTime;
        const intervalMs = settings.intervalMinutes * 60 * 1000;
        const remaining = Math.max(0, intervalMs - elapsed);
        setTimeRemaining(remaining);
      }
    } catch (error) {
      console.error('Failed to load blocking settings:', error);
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleOpen = async () => {
    try {
      // Increment block count
      await storageService.incrementBlockCount();
      
      // Navigate to learning screen
      navigation.navigate('Learning' as never);
    } catch (error) {
      console.error('Failed to handle open:', error);
    }
  };

  const handleSettings = () => {
    navigation.navigate('Settings' as never);
  };

  const showPlatformSpecificMessage = () => {
    if (Platform.OS === 'android') {
      return "Tap 'Open' to start learning and unlock your device.";
    } else {
      return "You'll receive a notification when it's time to learn.";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Screen Time Limit Reached</Text>
          <Text style={styles.subtitle}>
            You've been using your device for {blockingSettings?.intervalMinutes || 30} minutes
          </Text>
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Time Remaining</Text>
          <Text style={styles.timer}>
            {timeRemaining > 0 ? formatTime(timeRemaining) : '00:00'}
          </Text>
          <Text style={styles.timerSubtext}>
            {timeRemaining > 0 ? 'until you can use your device again' : 'Ready to learn!'}
          </Text>
        </View>

        {/* Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            {showPlatformSpecificMessage()}
          </Text>
          <Text style={styles.learningMessage}>
            Complete a quick learning session to continue using your device.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {Platform.OS === 'android' && timeRemaining === 0 && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleOpen}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Open & Learn</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSettings}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Blocks triggered today: {blockingSettings?.totalBlocksTriggered || 0}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.error,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  title: {
    ...theme.typography.text.h1,
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    ...theme.typography.text.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  timerLabel: {
    ...theme.typography.text.body,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing[2],
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  timerSubtext: {
    ...theme.typography.text.bodySmall,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
    maxWidth: 300,
  },
  message: {
    ...theme.typography.text.body,
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing[3],
    lineHeight: 24,
  },
  learningMessage: {
    ...theme.typography.text.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: theme.spacing[3],
  },
  primaryButton: {
    backgroundColor: 'white',
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.error,
    fontWeight: theme.typography.fontWeight.bold,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    ...theme.typography.text.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.medium,
  },
  statsContainer: {
    position: 'absolute',
    bottom: theme.spacing[6],
    alignItems: 'center',
  },
  statsText: {
    ...theme.typography.text.caption,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default BlockScreen;
