import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { storageService } from 'shared/lib/storage';
import { usageTrackingService } from 'shared/lib/services';
import { StatisticsCard } from 'features/statistics';

interface ProgressSummaryProps {
  onPress?: () => void;
  compact?: boolean;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ 
  onPress, 
  compact = false 
}) => {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    loadStatistics();
    
    // Refresh statistics every 30 seconds to keep time usage updated
    const interval = setInterval(() => {
      loadStatistics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Refresh statistics when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadStatistics();
    }, [])
  );

  const loadStatistics = async () => {
    try {
      setError(null);
      const [stats, totalUsageTime, todayUsageTime] = await Promise.all([
        storageService.getStatistics(),
        usageTrackingService.getTotalUsageTime(),
        usageTrackingService.getTodayUsageTime(),
      ]);
      
      setStatistics({
        ...stats,
        totalUsageTime,
        todayUsageTime,
      });
    } catch (err) {
      setError('Unable to load progress data');
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Loading progress...</Text>
        </View>
      </View>
    );
  }

  if (error || !statistics) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Failed to load progress'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadStatistics}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const content = (
    <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Track your learning journey</Text>
        </View>
        {onPress && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
            <Text style={styles.viewAllText}>View All</Text>
            <Text style={styles.viewAllArrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {compact ? (
        <View style={styles.compactGrid}>
          <View style={styles.compactStat}>
            <View style={styles.compactStatIcon}>
              <Text style={styles.compactStatIconText}>📚</Text>
            </View>
            <Text style={styles.compactValue}>{statistics.totalWords}</Text>
            <Text style={styles.compactLabel}>Total Words</Text>
          </View>
          <View style={styles.compactStat}>
            <View style={styles.compactStatIcon}>
              <Text style={styles.compactStatIconText}>✅</Text>
            </View>
            <Text style={[styles.compactValue, { color: '#34C759' }]}>
              {statistics.learnedWords}
            </Text>
            <Text style={styles.compactLabel}>Learned</Text>
          </View>
          <View style={styles.compactStat}>
            <View style={styles.compactStatIcon}>
              <Text style={styles.compactStatIconText}>🔥</Text>
            </View>
            <Text style={[styles.compactValue, { color: '#FF9500' }]}>
              {statistics.currentStreak}
            </Text>
            <Text style={styles.compactLabel}>Day Streak</Text>
          </View>
          <View style={styles.compactStat}>
            <View style={styles.compactStatIcon}>
              <Text style={styles.compactStatIconText}>⏱️</Text>
            </View>
            <Text style={[styles.compactValue, { color: '#AF52DE' }]}>
              {formatTime(statistics.totalUsageTime || statistics.totalTimeSpent)}
            </Text>
            <Text style={styles.compactLabel}>Time Spent</Text>
          </View>
        </View>
      ) : (
        <View style={styles.statsGrid}>
          <StatisticsCard
            title="Total Words"
            value={statistics.totalWords}
            color="#007AFF"
            size="small"
          />
          <StatisticsCard
            title="Words Learned"
            value={statistics.learnedWords}
            subtitle={`${statistics.learningRate.toFixed(1)}% success`}
            color="#34C759"
            size="small"
          />
          <StatisticsCard
            title="Current Streak"
            value={statistics.currentStreak}
            subtitle="days"
            color="#FF9500"
            size="small"
          />
          <StatisticsCard
            title="Time Spent"
            value={formatTime(statistics.totalUsageTime || statistics.totalTimeSpent)}
            color="#AF52DE"
            size="small"
          />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 4,
  },
  viewAllArrow: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 15,
    color: '#FF3B30',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  compactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compactStat: {
    alignItems: 'center',
    flex: 1,
  },
  compactStatIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactStatIconText: {
    fontSize: 16,
  },
  compactValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  compactLabel: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default ProgressSummary;
