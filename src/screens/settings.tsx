import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storageService } from 'shared/lib/storage';
import { usageTrackingService } from 'shared/lib/services';
import { blockingService } from 'shared/lib/services/blocking-service';
import { theme } from 'shared/theme';
import { BlockingSettings, AppSettings } from 'shared/lib/types';
import { ShieldCheckIcon, ClockIcon } from 'phosphor-react-native';

const BLOCKING_INTERVALS = [
  { label: '15 minutes', value: 15 },
  { label: '20 minutes', value: 20 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1 day', value: 1440 },
];

const SettingsScreen = () => {
  const [blockingSettings, setBlockingSettings] = useState<BlockingSettings | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

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

      // Check monitoring status and permissions
      const [monitoringActive, permissionStatus] = await Promise.all([
        blockingService.isBackgroundMonitoringActive(),
        blockingService.checkPermissions(),
      ]);
      
      setIsMonitoringActive(monitoringActive);
      setHasPermission(permissionStatus);
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

      // Restart monitoring with new interval if active
      if (isMonitoringActive) {
        await blockingService.stopBackgroundMonitoring();
        await blockingService.startBackgroundMonitoring();
      }
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

      if (enabled) {
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Usage stats permission is required for screen time blocking. Please grant permission in the next screen.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Grant Permission', 
                onPress: () => {
                  // This will open the usage access settings
                  import('native/android/usage-stats-manager').then(({ openUsageAccessSettings }) => {
                    openUsageAccessSettings();
                  });
                }
              },
            ]
          );
          return;
        }

        const success = await blockingService.startBackgroundMonitoring();
        if (success) {
          setIsMonitoringActive(true);
          Alert.alert('Success', 'Background monitoring started successfully!');
        } else {
          Alert.alert('Error', 'Failed to start background monitoring. Please check permissions.');
        }
      } else {
        const success = await blockingService.stopBackgroundMonitoring();
        if (success) {
          setIsMonitoringActive(false);
          Alert.alert('Success', 'Background monitoring stopped successfully!');
        }
      }
    } catch (error) {
      console.error('Failed to toggle blocking:', error);
      Alert.alert('Error', 'Failed to update blocking settings');
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

  const checkBlockingStatus = async () => {
    try {
      const status = await blockingService.shouldBlock();
      Alert.alert(
        'Current Blocking Status',
        `Should Block: ${status.shouldBlock ? 'Yes' : 'No'}\n` +
        `Usage: ${Math.round(status.usagePercentage)}%\n` +
        `Time Used: ${Math.round(status.totalUsageTime / (1000 * 60))} minutes\n` +
        `Remaining: ${Math.round(status.remainingMinutes)} minutes`
      );
    } catch (error) {
      console.error('Failed to check blocking status:', error);
      Alert.alert('Error', 'Failed to check blocking status');
    }
  };

  const requestPermissions = () => {
    import('native/android/usage-stats-manager').then(({ openUsageAccessSettings }) => {
      openUsageAccessSettings();
    });
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
    <View style={styles.container}>

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
              {!hasPermission && (
                <Text style={styles.permissionWarning}>
                  ⚠️ Usage stats permission required
                </Text>
              )}
            </View>
            <Switch
              value={blockingSettings?.isEnabled || false}
              onValueChange={toggleBlocking}
              trackColor={{ false: theme.semanticColors.borderLight, true: theme.semanticColors.brand }}
              thumbColor="white"
            />
          </View>

          {!hasPermission && (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermissions}
            >
              <ShieldCheckIcon size={20} color="white" />
              <Text style={styles.permissionButtonText}>Grant Usage Permission</Text>
            </TouchableOpacity>
          )}

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Background Monitoring</Text>
              <Text style={styles.settingDescription}>
                Status: {isMonitoringActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.statusButton}
              onPress={checkBlockingStatus}
            >
              <ClockIcon size={20} color={theme.semanticColors.brand} />
              <Text style={styles.statusButtonText}>Check Status</Text>
            </TouchableOpacity>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  permissionWarning: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.error,
    marginTop: theme.spacing[1],
  },
  permissionButton: {
    backgroundColor: theme.semanticColors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[4],
    gap: theme.spacing[2],
  },
  permissionButtonText: {
    ...theme.typography.text.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.medium,
  },
  statusButton: {
    backgroundColor: theme.semanticColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.semanticColors.borderLight,
    gap: theme.spacing[2],
  },
  statusButtonText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.brand,
    fontWeight: theme.typography.fontWeight.medium,
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
});

export default SettingsScreen;
