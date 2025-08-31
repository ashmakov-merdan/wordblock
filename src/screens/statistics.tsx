import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'shared/ui';
import { storageService } from 'shared/lib/storage';
import { usageTrackingService } from 'shared/lib/services';
import { theme } from 'shared/theme';
import { ProgressSummary } from 'widgets';
import { ChartFilters, MetricsCard } from 'features/statistics';

interface ChartData {
  totalWords: number;
  learnedWords: number;
  totalTimeSpent: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalBlocksTriggered: number;
  todaySessions: number;
  averageSessionTime: number;
  learningRate: number;
  totalUsageTime: number;
  todayUsageTime: number;
  dailyUsage: any[];
  weeklyUsage: any[];
  monthlyUsage: any[];
}

const StatisticsScreen = () => {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartFilter, setChartFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const loadData = React.useCallback(async () => {
    try {
      setError(null);
      const [stats, dailyUsage, weeklyUsage, monthlyUsage, totalUsageTime, todayUsageTime] = await Promise.all([
        storageService.getStatistics(),
        usageTrackingService.getDailyUsage(7),
        usageTrackingService.getDailyUsage(28), // For weekly view
        usageTrackingService.getDailyUsage(90), // For monthly view
        usageTrackingService.getTotalUsageTime(),
        usageTrackingService.getTodayUsageTime(),
      ]);

      console.log('Statistics Data:', {
        stats,
        dailyUsage: dailyUsage.length,
        weeklyUsage: weeklyUsage.length,
        monthlyUsage: monthlyUsage.length,
        totalUsageTime,
        todayUsageTime,
      });
      
      setData({
        ...stats,
        totalUsageTime,
        todayUsageTime,
        dailyUsage,
        weeklyUsage,
        monthlyUsage,
      });
    } catch (err) {
      setError('Unable to load statistics data');
    } finally {
      setLoading(false);
    }
  }, []);



  useEffect(() => {
    loadData();
    usageTrackingService.startSession('Statistics');

    return () => {
      usageTrackingService.endCurrentSession();
    };
  }, [loadData]);

  // Debug: Check if usage sessions exist
  useEffect(() => {
    const checkUsageSessions = async () => {
      try {
        const sessions = await usageTrackingService.getSessions();
        console.log('Total Usage Sessions:', sessions.length);
        if (sessions.length > 0) {
          console.log('Sample Session:', sessions[0]);
        }
      } catch (error) {
        console.error('Error checking usage sessions:', error);
      }
    };
    
    checkUsageSessions();
  }, []);

  const getChartData = () => {
    if (!data) return [];

    console.log('Current Chart Filter:', chartFilter);
    
    switch (chartFilter) {
      case 'daily':
        return getDailyData();
      case 'weekly':
        return getWeeklyData();
      case 'monthly':
        return getMonthlyData();
      default:
        return getDailyData();
    }
  };

  const getDailyData = () => {
    if (!data?.dailyUsage) return [];

    console.log('Daily Usage Data:', data.dailyUsage);
    
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData: Array<{label: string; value: number; color: string}> = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayUsage = data.dailyUsage.find(usage => usage.date === dateKey);

      weekData.push({
        label: weekDays[date.getDay()],
        value: dayUsage ? Math.round(dayUsage.totalTime / (1000 * 60)) : 0,
        color: theme.semanticColors.brand,
      });
    }

    console.log('Daily Chart Data:', weekData);
    return weekData;
  };

  const getWeeklyData = () => {
    if (!data?.weeklyUsage) return [];

    console.log('Weekly Usage Data:', data.weeklyUsage);
    
    const weekData: Array<{label: string; value: number; color: string}> = [];
    const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    // Take the last 4 weeks of data
    const recentWeeks = data.weeklyUsage.slice(-4);
    
    recentWeeks.forEach((week, index) => {
      weekData.push({
        label: weekLabels[index] || `Week ${index + 1}`,
        value: Math.round(week.totalTime / (1000 * 60)),
        color: theme.semanticColors.success,
      });
    });

    console.log('Weekly Chart Data:', weekData);
    return weekData;
  };

  const getMonthlyData = () => {
    if (!data?.monthlyUsage) return [];

    console.log('Monthly Usage Data:', data.monthlyUsage);
    
    const monthData: Array<{label: string; value: number; color: string}> = [];

    // Take the last 6 months of data
    const recentMonths = data.monthlyUsage.slice(-6);
    
    recentMonths.forEach((month) => {
      const monthDate = new Date(month.date);
      monthData.push({
        label: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        value: Math.round(month.totalTime / (1000 * 60)),
        color: theme.semanticColors.warning,
      });
    });

    console.log('Monthly Chart Data:', monthData);
    return monthData;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.semanticColors.brand} />
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Failed to load statistics data'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.cardsContainer}>
            <ProgressSummary compact />
          </View>
        </View>

        {/* Usage Analytics */}
        <View style={styles.section}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Usage Analytics</Text>
            <View style={styles.filterContainer}>
              <ChartFilters
                filter={chartFilter}
                onFilterChange={setChartFilter}
              />
            </View>
          </View>
          {(() => {
            const chartData = getChartData();
            console.log('Chart Data for BarChart:', chartData);
            return (
              <BarChart
                data={chartData}
                height={250}
                showValues={true}
                title="Usage Analytics"
              />
            );
          })()}
        </View>

        {/* Additional Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Metrics</Text>
          <View style={styles.metricsGrid}>
            <MetricsCard
              value={data.longestStreak}
              label="Longest Streak"
              unit="days"
            />
            <MetricsCard
              value={data.totalBlocksTriggered}
              label="Blocks Triggered"
              unit="screen time managed"
            />
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>Learning Efficiency</Text>
              <Text style={styles.insightValue}>
                {data.learningRate >= 80
                  ? 'Excellent'
                  : data.learningRate >= 60
                    ? 'Good'
                    : 'Improving'
                }
              </Text>
              <Text style={styles.insightDescription}>
                Your learning efficiency is {data.learningRate.toFixed(1)}%.
                {data.learningRate >= 80
                  ? ' Keep up the excellent work!'
                  : data.learningRate >= 60
                    ? ' Consistent practice will improve this further.'
                    : ' Regular study sessions will help improve your success rate.'
                }
              </Text>
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>Study Consistency</Text>
              <Text style={styles.insightValue}>
                {data.currentStreak >= 7
                  ? 'Outstanding'
                  : data.currentStreak >= 3
                    ? 'Good'
                    : 'Starting'
                }
              </Text>
              <Text style={styles.insightDescription}>
                {data.currentStreak > 0
                  ? `You've maintained a ${data.currentStreak}-day streak. `
                  : 'Start your learning journey today! '
                }
                {data.currentStreak >= 7
                  ? 'This level of consistency will lead to great results.'
                  : data.currentStreak >= 3
                    ? 'Try to maintain this momentum for better results.'
                    : 'Building daily habits is key to long-term success.'
                }
              </Text>
            </View>
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
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.semanticColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.semanticColors.borderLight,
  },
  title: {
    ...theme.typography.text.h3,
    color: theme.semanticColors.textPrimary,
  },
  scrollView: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
  },
  errorText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.error,
    textAlign: 'center',
  },
  section: {
    padding: theme.spacing[6],
    paddingBottom: theme.spacing[4],
  },
  sectionTitle: {
    ...theme.typography.text.h4,
    color: theme.semanticColors.textPrimary,
    marginBottom: theme.spacing[4],
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  filterContainer: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  cardsContainer: {
    gap: theme.spacing[3],
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  insightsContainer: {
    gap: theme.spacing[4],
  },
  insightCard: {
    backgroundColor: theme.semanticColors.surface,
    padding: theme.spacing[5],
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  insightTitle: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    marginBottom: theme.spacing[2],
    fontWeight: theme.typography.fontWeight.medium,
  },
  insightValue: {
    ...theme.typography.text.h3,
    color: theme.semanticColors.brand,
    marginBottom: theme.spacing[2],
  },
  insightDescription: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
  },
});

export default StatisticsScreen;
