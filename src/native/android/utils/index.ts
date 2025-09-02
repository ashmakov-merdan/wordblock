import usage from '../modules';

export const loadStats = async () => {
  const now = Date.now();

  const dailyUsage = await usage.getAppUsage(now - 24 * 60 * 60 * 1000, now);

  const weeklyUsage = await usage.getAppUsage(now - 7 * 24 * 60 * 60 * 1000, now);

  const monthlyUsage = await usage.getAppUsage(now - 30 * 24 * 60 * 60 * 1000, now);

  return { 
    dailyUsage: dailyUsage ? dailyUsage.totalTimeInForeground : 0, 
    weeklyUsage: weeklyUsage ? weeklyUsage.totalTimeInForeground : 0, 
    monthlyUsage: monthlyUsage ? monthlyUsage.totalTimeInForeground : 0,
  };
};
