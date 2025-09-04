import SettingsItem from "features/settings-item";
import { useCallback, useEffect, useState } from "react";
import stats from 'native/android/modules';
import { AppState } from "react-native";

const UsageTimeSwitcher = () => {
  const [isEnabled, setEnable] = useState<boolean>(false);

  const checkPermission = useCallback(async () => {
    const hasPermission = await stats.hasUsagePermission();
    setEnable(hasPermission);
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkPermission();
      }
    });

    return () => subscription.remove();
  }, [checkPermission]);

  const toggleUsageTime = useCallback(async () => {
    await stats.openUsageAccessSettings();
  }, []);

  return (
    <SettingsItem
      label="Usage Time"
      description="Enable usage time"
      value={isEnabled}
      onChange={toggleUsageTime}
    />
  )
};

export default UsageTimeSwitcher;