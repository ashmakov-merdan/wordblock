import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useAppSettings, useBlockingSettings } from 'entities/settings';
import { BLOCKING_INTERVAL } from 'entities/settings';
import { theme } from 'shared/theme';
import BlockingInterval from 'features/blocking-interval';

export default function SettingsScreen() {  
  const { blockingSettings, updateBlockingSettings} = useBlockingSettings();
  const { appSettings, updateAppSettings } = useAppSettings();

  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Settings are loaded automatically by the store
      // Check if we have permission to access usage stats
      setHasPermission(true); // For now, assume permission is granted
      setLoading(false);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setLoading(false);
    }
  };

  const updateBlockingInterval = async (intervalMinutes: BLOCKING_INTERVAL) => {
    try {
      updateBlockingSettings({
        intervalMinutes: intervalMinutes as BLOCKING_INTERVAL,
      });
    } catch (error) {
      console.error('Failed to update blocking interval:', error);
    }
  };

  const toggleBlocking = async (enabled: boolean) => {
    try {
      updateBlockingSettings({
        isEnabled: enabled,
      });

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

        Alert.alert('Success', 'Blocking enabled successfully!');
      } else {
        Alert.alert('Success', 'Blocking disabled successfully!');
      }
    } catch (error) {
      console.error('Failed to toggle blocking:', error);
      Alert.alert('Error', 'Failed to update blocking settings');
    }
  };

  const toggleNotifications = async (enabled: boolean) => {
    try {
      updateAppSettings({
        notifications: enabled,
      });
    } catch (error) {
      console.error('Failed to update notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const toggleSound = async (enabled: boolean) => {
    try {
      updateAppSettings({
        soundEnabled: enabled,
      });
    } catch (error) {
      console.error('Failed to toggle sound:', error);
    }
  };

  const checkBlockingStatus = async () => {
    try {
      const status = {
        shouldBlock: blockingSettings.isEnabled,
        usagePercentage: 0, // This would need to be calculated from actual usage data
        totalUsageTime: 0, // This would need to be calculated from actual usage data
        remainingMinutes: blockingSettings.intervalMinutes
      };
      
      Alert.alert(
        'Current Blocking Status',
        `Should Block: ${status.shouldBlock ? 'Yes' : 'No'}\n` +
        `Interval: ${status.remainingMinutes} minutes\n` +
        `Status: ${blockingSettings.isEnabled ? 'Enabled' : 'Disabled'}`
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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
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
              value={blockingSettings.isEnabled || false}
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
              <Text style={styles.permissionButtonText}>Grant Usage Permission</Text>
            </TouchableOpacity>
          )}

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Blocking Status</Text>
              <Text style={styles.settingDescription}>
                Status: {blockingSettings.isEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.statusButton}
              onPress={checkBlockingStatus}
            >
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
              value={appSettings.notifications || false}
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.colors.border.light, true: theme.colors.primary[500] }}
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
              value={appSettings.soundEnabled || false}
              onValueChange={toggleSound}
              trackColor={{ false: theme.colors.border.light, true: theme.colors.primary[500] }}
              thumbColor="white"
            />
          </View>

          <BlockingInterval
            defaultValue={blockingSettings?.intervalMinutes || BLOCKING_INTERVAL.FIFTEEN}
            onChangeBlockingInterval={updateBlockingInterval}
          /> 
        </View>
      </ScrollView>
    </View>
  );
}

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
