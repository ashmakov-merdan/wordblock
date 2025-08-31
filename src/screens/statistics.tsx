import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { ProgressChart, BarChart, LineChart } from 'features/charts';
import { StatisticsCard } from 'features/statistics';
import { storageService } from 'shared/lib/storage';
import { theme } from 'shared/theme';

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
}

const StatisticsScreen = () => {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const stats = await storageService.getStatistics();
      setData(stats);
    } catch (err) {
      setError('Unable to load statistics data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Sample data for charts
  const weeklyProgressData = [
    { label: 'Mon', value: 5 },
    { label: 'Tue', value: 8 },
    { label: 'Wed', value: 12 },
    { label: 'Thu', value: 6 },
    { label: 'Fri', value: 15 },
    { label: 'Sat', value: 10 },
    { label: 'Sun', value: 7 },
  ];

  const sessionTimeData = [
    { label: 'Mon', value: 25, color: theme.semanticColors.brand },
    { label: 'Tue', value: 35, color: theme.semanticColors.success },
    { label: 'Wed', value: 20, color: theme.semanticColors.warning },
    { label: 'Thu', value: 40, color: theme.colors.purple[500] },
    { label: 'Fri', value: 30, color: theme.semanticColors.error },
    { label: 'Sat', value: 45, color: theme.semanticColors.brand },
    { label: 'Sun', value: 15, color: theme.semanticColors.success },
  ];

  const learningTrendData = [
    { label: 'Week 1', value: 20 },
    { label: 'Week 2', value: 35 },
    { label: 'Week 3', value: 28 },
    { label: 'Week 4', value: 42 },
    { label: 'Week 5', value: 38 },
    { label: 'Week 6', value: 50 },
  ];

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
        {/* Statistics Cards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.cardsContainer}>
            <StatisticsCard
              title="Words Learned"
              value={`${data.learnedWords}/${data.totalWords}`}
              subtitle="Total progress"
              color={theme.semanticColors.success}
              size="medium"
            />
            <StatisticsCard
              title="Current Streak"
              value={data.currentStreak}
              subtitle="days"
              color={theme.semanticColors.brand}
              size="medium"
            />
            <StatisticsCard
              title="Total Time"
              value={formatTime(data.totalTimeSpent)}
              subtitle="spent learning"
              color={theme.colors.purple[500]}
              size="medium"
            />
            <StatisticsCard
              title="Study Sessions"
              value={data.totalSessions}
              subtitle="completed"
              color={theme.semanticColors.warning}
              size="medium"
            />
          </View>
        </View>

        {/* Learning Progress Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <View style={styles.progressContainer}>
            <ProgressChart
              percentage={data.learningRate}
              size={150}
              strokeWidth={12}
              title="Overall Progress"
              subtitle={`${data.learnedWords} of ${data.totalWords} words`}
              color={theme.semanticColors.success}
            />
          </View>
        </View>

        {/* Weekly Progress Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress Trend</Text>
          <LineChart
            data={weeklyProgressData}
            title="Words Learned This Week"
            subtitle="Daily learning progress"
            color={theme.semanticColors.brand}
            height={250}
          />
        </View>

        {/* Session Time Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Time Analysis</Text>
          <BarChart
            data={sessionTimeData}
            title="Daily Study Sessions"
            subtitle="Minutes spent learning each day"
            height={250}
            showValues={true}
          />
        </View>

        {/* Learning Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Trend</Text>
          <LineChart
            data={learningTrendData}
            title="6-Week Learning Journey"
            subtitle="Words learned per week"
            color={theme.colors.purple[500]}
            height={250}
          />
        </View>

        {/* Additional Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{data.longestStreak}</Text>
              <Text style={styles.metricLabel}>Longest Streak</Text>
              <Text style={styles.metricUnit}>days</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{data.todaySessions}</Text>
              <Text style={styles.metricLabel}>Today's Sessions</Text>
              <Text style={styles.metricUnit}>completed</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{formatTime(data.averageSessionTime)}</Text>
              <Text style={styles.metricLabel}>Average Session</Text>
              <Text style={styles.metricUnit}>duration</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{data.totalBlocksTriggered}</Text>
              <Text style={styles.metricLabel}>Blocks Triggered</Text>
              <Text style={styles.metricUnit}>screen time managed</Text>
            </View>
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
    marginTop: theme.spacing[4],
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
  metricCard: {
    backgroundColor: theme.semanticColors.surface,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    width: '48%',
    marginBottom: theme.spacing[3],
    alignItems: 'center',
    ...theme.shadows.md,
  },
  metricValue: {
    ...theme.typography.text.h2,
    color: theme.semanticColors.brand,
    fontWeight: theme.typography.fontWeight.bold,
  },
  metricLabel: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },
  metricUnit: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing[1],
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
    lineHeight: theme.typography.lineHeight.relaxed,
  },
});

export default StatisticsScreen;
