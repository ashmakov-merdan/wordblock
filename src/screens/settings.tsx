import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BLOCKING_INTERVAL } from 'entities/settings';
import { theme } from 'shared/theme';
import BlockingInterval from 'features/blocking-interval';
import SettingsItem from 'features/settings-item';
import { UsageTimeSwitcher } from 'features/settings';
import stats from 'native/android/modules';
import { useFocusEffect } from '@react-navigation/native';

export default function SettingsScreen() {
  const [interval, setInterval] = useState<BLOCKING_INTERVAL>(BLOCKING_INTERVAL.FIFTEEN);
  const [isPinned, setPin] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState(false);

  const checkPinned = useCallback(async () => {
    const pin = await stats.isPinned();

    if (pin) {
      setPin(true);
    } else {
      setPin(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkPinned();
    }, [checkPinned])
  );

  const toggleBlocking = useCallback(async () => {
    if (isPinned) {
      await stats.setBlocking(false);
    } else {
      await stats.setBlocking(true);
    };
  }, [isPinned]);

  const requestPermissions = () => {
    console.log('Requesting permissions...');
    setHasPermission(true);
  };

  const checkBlockingStatus = () => {
    console.log('Checking blocking status...');
  };

  const updateBlockingInterval = (intervalMinutes: BLOCKING_INTERVAL) => {
    setInterval(intervalMinutes);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <UsageTimeSwitcher />

          <SettingsItem
            label='Enable Blocking'
            description='Automatically block device access after time limit'
            value={isPinned}
            onChange={toggleBlocking}
          />

          {!hasPermission && (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermissions}
            >
              <Text style={styles.permissionButtonText}>Grant Usage Permission</Text>
            </TouchableOpacity>
          )}

          <SettingsItem
            label={'Blocking Status'}
            description={`Status: ${false ? 'Enabled' : 'Disabled'}`}
            value={false}
            onChange={checkBlockingStatus}
          />

          <BlockingInterval
            defaultValue={interval}
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
    gap: theme.spacing[4],
  },
  sectionTitle: {
    ...theme.typography.text.h4,
    color: theme.semanticColors.textPrimary,
    marginBottom: theme.spacing[4],
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
});
