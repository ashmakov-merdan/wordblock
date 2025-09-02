import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import UsageStats from 'native/android/modules';
import { loadStats } from 'native/android/utils';

export default function UsageStatsScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [ daily, setDaily ] = useState<number>(0);
  const [ weekly, setWeekly ] = useState<number>(0);
  const [ monthly, setMonthly ] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const granted = await UsageStats.hasUsagePermission();
      setHasPermission(granted);
    })();
  }, []);

  useEffect(() => {
    if (hasPermission) {
      loadStats().then(({ dailyUsage, weeklyUsage, monthlyUsage }) => {
        setDaily(dailyUsage);
        setWeekly(weeklyUsage);
        setMonthly(monthlyUsage);
      });
    }
  }, [hasPermission]);

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 40 }}>
      <Text>Usage permission: {hasPermission ? '✅ Granted' : '❌ Not granted'}</Text>

      {!hasPermission && (
        <Button
          title="Grant Usage Access"
          onPress={() => UsageStats.openUsageAccessSettings()}
        />
      )}

      <View style={{ height: 12 }} />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Load My Usage" onPress={loadStats} />

        {daily !== null && (
          <>
            <Text>Daily: {Math.round(daily / 1000 / 60)} minutes</Text>
            <Text>Weekly: {Math.round(weekly / 1000 / 60)} minutes</Text>
            <Text>Monthly: {Math.round(monthly / 1000 / 60)} minutes</Text>
          </>
        )}
      </View>
    </View>
  );
}
