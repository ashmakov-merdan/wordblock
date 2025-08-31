import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { storageService } from 'shared/lib/storage';
import { usageTrackingService } from 'shared/lib/services';
import { theme } from 'shared/theme';
import { BlockingSettings, AppSettings } from 'shared/lib/types';

const BLOCKING_INTERVALS = [
  { label: '15 minutes', value: 15 },
  { label: '20 minutes', value: 20 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1 day', value: 1440 },
];

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [blockingSettings, setBlockingSettings] = useState<BlockingSettings | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    usageTrackingService.startSession('Settings');
    
    return () => {
      usageTrackingService.endCurrentSession();
    };
  }, []);

  const loadSettings = async () => {
    try {
      const [blocking, app] = await Promise.all([
        storageService.getBlockingSettings(),
        storageService.getAppSettings(),
      ]);
      setBlockingSettings(blocking);
      setAppSettings(app);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBlockingInterval = async (intervalMinutes: number) => {
    try {
      const updated = await storageService.updateBlockingSettings({
        intervalMinutes: intervalMinutes as any,
      });
      setBlockingSettings(updated);
    } catch (error) {
      console.error('Failed to update blocking interval:', error);
    }
  };

  const toggleBlocking = async (enabled: boolean) => {
    try {
      const updated = await storageService.updateBlockingSettings({
        isEnabled: enabled,
      });
      setBlockingSettings(updated);
    } catch (error) {
      console.error('Failed to toggle blocking:', error);
    }
  };

  const toggleNotifications = async (enabled: boolean) => {
    try {
      const updated = await storageService.updateAppSettings({
        notifications: enabled,
      });
      setAppSettings(updated);
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
    }
  };

  const toggleSound = async (enabled: boolean) => {
    try {
      const updated = await storageService.updateAppSettings({
        soundEnabled: enabled,
      });
      setAppSettings(updated);
    } catch (error) {
      console.error('Failed to toggle sound:', error);
    }
  };



  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Blocking Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Screen Time Management</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Blocking</Text>
              <Text style={styles.settingDescription}>
                Automatically block device access after time limit
              </Text>
            </View>
            <Switch
              value={blockingSettings?.isEnabled || false}
              onValueChange={toggleBlocking}
              trackColor={{ false: theme.semanticColors.borderLight, true: theme.semanticColors.brand }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications for learning reminders
              </Text>
            </View>
            <Switch
              value={appSettings?.notifications || false}
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.semanticColors.borderLight, true: theme.semanticColors.brand }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Play sounds for interactions and alerts
              </Text>
            </View>
            <Switch
              value={appSettings?.soundEnabled || false}
              onValueChange={toggleSound}
              trackColor={{ false: theme.semanticColors.borderLight, true: theme.semanticColors.brand }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Blocking Interval</Text>
            <Text style={styles.settingDescription}>
              How long to use device before blocking
            </Text>
            <View style={styles.intervalOptions}>
              {BLOCKING_INTERVALS.map((interval) => (
                <TouchableOpacity
                  key={interval.value}
                  style={[
                    styles.intervalOption,
                    blockingSettings?.intervalMinutes === interval.value && styles.intervalOptionSelected
                  ]}
                  onPress={() => updateBlockingInterval(interval.value)}
                >
                  <Text style={[
                    styles.intervalOptionText,
                    blockingSettings?.intervalMinutes === interval.value && styles.intervalOptionTextSelected
                  ]}>
                    {interval.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>



        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{blockingSettings?.totalBlocksTriggered || 0}</Text>
              <Text style={styles.statLabel}>Blocks Triggered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{blockingSettings?.intervalMinutes || 30}</Text>
              <Text style={styles.statLabel}>Current Interval (min)</Text>
            </View>
          </View>
        </View>



        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>WordBlock v0.0.1</Text>
            <Text style={styles.infoText}>Learn words while managing screen time</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.semanticColors.borderLight,
  },
  backButton: {
    padding: theme.spacing[2],
  },
  backButtonText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.brand,
    fontWeight: theme.typography.fontWeight.medium,
  },
  headerTitle: {
    ...theme.typography.text.h3,
    color: theme.semanticColors.textPrimary,
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textSecondary,
  },
  section: {
    padding: theme.spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: theme.semanticColors.borderLight,
  },
  sectionTitle: {
    ...theme.typography.text.h4,
    color: theme.semanticColors.textPrimary,
    marginBottom: theme.spacing[4],
  },
  settingItem: {
    marginBottom: theme.spacing[5],
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing[3],
  },
  settingLabel: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing[1],
  },
  settingDescription: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
  },
  intervalOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginTop: theme.spacing[3],
  },
  intervalOption: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.semanticColors.borderLight,
    backgroundColor: theme.semanticColors.surface,
  },
  intervalOptionSelected: {
    backgroundColor: theme.semanticColors.brand,
    borderColor: theme.semanticColors.brand,
  },
  intervalOptionText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  intervalOptionTextSelected: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.semanticColors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  statValue: {
    ...theme.typography.text.h2,
    color: theme.semanticColors.brand,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
  },

  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing[1],
  },
});

export default SettingsScreen;
