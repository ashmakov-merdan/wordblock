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
import { theme } from 'shared/theme';
import { ChartFilters, getDailyData, getMonthlyData, getWeeklyData } from 'features/statistics';
import { SummaryList } from 'features/summary';
import { useWordsStore } from 'entities/words';
import { useStudySessionStore } from 'entities/sessions';
import { useSettingsStore } from 'entities/settings';

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
  const [chartFilter, setChartFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Get data from stores
  const { getWordStats } = useWordsStore();
  const { getTotalStudyTime, getAverageSessionTime, getTodaySessions, sessions } = useStudySessionStore();
  const { defaults } = useSettingsStore();

  const loadData = React.useCallback(async () => {
    try {
      setError(null);

      // Get word statistics
      const wordStats = getWordStats();

      // Get session statistics
      const totalTimeSpent = getTotalStudyTime();
      const averageSessionTime = getAverageSessionTime();
      const todaySessions = getTodaySessions();

      // Calculate learning rate (words learned per session)
      const learningRate = defaults.progress.totalSessions > 0
        ? Math.round((defaults.progress.learnedWords / defaults.progress.totalSessions) * 100) / 100
        : 0;

      const statsData: ChartData = {
        totalWords: wordStats.total,
        learnedWords: wordStats.learned,
        totalTimeSpent,
        totalSessions: defaults.progress.totalSessions,
        currentStreak: defaults.progress.currentStreak,
        longestStreak: defaults.progress.longestStreak,
        totalBlocksTriggered: defaults.blockingSettings.totalBlocksTriggered,
        todaySessions: todaySessions.length,
        averageSessionTime,
        learningRate,
      };

      setData(statsData);
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError('Unable to load statistics data');
    } finally {
      setLoading(false);
    }
  }, [getWordStats, getTotalStudyTime, getAverageSessionTime, getTodaySessions, defaults]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getChartData = () => {
    if (!data) return [];

    switch (chartFilter) {
      case 'daily':
        return getDailyData(sessions);
      case 'weekly':
        return getWeeklyData(sessions);
      case 'monthly':
        return getMonthlyData(sessions);
      default:
        return getDailyData(sessions);
    }
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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <SummaryList />
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

            return (
              <BarChart
                data={chartData}
                height={250}
                showValues={true}
              />
            );
          })()}
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
});

export default StatisticsScreen;
