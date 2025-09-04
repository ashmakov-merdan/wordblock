import { SummaryCard } from "features/summary";
import { ClockIcon } from "phosphor-react-native";
import { colors } from "shared/theme/colors";
import stats from 'native/android/modules';
import { useEffect, useState } from "react";

const formatTime = (milliseconds: number): string => {
  if (milliseconds === 0) return '0s';
  
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

const UsageTime = () => {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const loadTotal = async () => {
      const res = await stats.getAppUsage();
      if (res) {
        setTotal(res.totalTimeInForeground); // milliseconds
      } else {
        setTotal(0);
      }
    };

    loadTotal();
  }, []);

  return (
    <SummaryCard
      title="Usage Time"
      value={formatTime(total)}
      icon={ClockIcon}
      color={colors.warning[500]}
    />
  )
};

UsageTime.displayName = 'UsageTime';

export default UsageTime;