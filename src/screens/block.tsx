import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'shared/ui';
import { theme } from 'shared/theme';
import { useNavigation } from '@react-navigation/native';
import { useSettingsStore } from 'entities/settings';
import { ShieldCheckIcon, ClockIcon, BookOpenIcon } from 'phosphor-react-native';

const BlockScreen = () => {
  const navigation = useNavigation();
  const { defaults, updateBlockingSettings } = useSettingsStore();
  const [timeRemaining, setTimeRemaining] = useState(20); // 20 seconds countdown

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOpenApp = () => {
    // Increment block count
    updateBlockingSettings({
      totalBlocksTriggered: defaults.blockingSettings.totalBlocksTriggered + 1,
      lastBlockTime: Date.now()
    });

    // Navigate to Learning screen
    navigation.navigate('Learning' as never);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ShieldCheckIcon size={80} color={theme.semanticColors.error} weight="fill" />
          <Text style={styles.title}>Screen Time Limit Reached</Text>
          <Text style={styles.subtitle}>
            You've used your device for {defaults.blockingSettings.intervalMinutes} minutes
          </Text>
        </View>

        {/* Timer Section */}
        <View style={styles.timerSection}>
          <ClockIcon size={48} color={theme.semanticColors.brand} weight="fill" />
          <Text style={styles.timerLabel}>Time Remaining</Text>
          <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.timerDescription}>
            Complete a learning session to continue using your device
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>What happens next?</Text>
          <View style={styles.instructionItem}>
            <BookOpenIcon size={24} color={theme.semanticColors.brand} />
            <Text style={styles.instructionText}>
              You'll be taken to a learning session
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <ClockIcon size={24} color={theme.semanticColors.brand} />
            <Text style={styles.instructionText}>
              Stay on the learning screen for at least 20 seconds
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <ShieldCheckIcon size={24} color={theme.semanticColors.success} />
            <Text style={styles.instructionText}>
              Confirm you've learned something new
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <Button
            title="Start Learning Session"
            subtitle="Tap to begin your learning journey"
            onPress={handleOpenApp}
            size="sm"
            color="primary"
            icon={BookOpenIcon}
          />
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            This is your {defaults.blockingSettings.totalBlocksTriggered + 1} learning break today
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing[6],
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing[8],
  },
  title: {
    ...theme.typography.text.h2,
    color: theme.semanticColors.textPrimary,
    textAlign: 'center',
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    ...theme.typography.text.bodyLarge,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  timerSection: {
    alignItems: 'center',
    marginVertical: theme.spacing[8],
  },
  timerLabel: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textSecondary,
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[2],
  },
  timer: {
    ...theme.typography.text.h1,
    color: theme.semanticColors.brand,
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    marginBottom: theme.spacing[3],
  },
  timerDescription: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  instructions: {
    marginVertical: theme.spacing[6],
  },
  instructionsTitle: {
    ...theme.typography.text.h4,
    color: theme.semanticColors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
    gap: theme.spacing[3],
  },
  instructionText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textSecondary,
    flex: 1,
  },
  actionSection: {
    marginVertical: theme.spacing[6],
  },
  stats: {
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  statsText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textTertiary,
    textAlign: 'center',
  },
});

export default BlockScreen;
