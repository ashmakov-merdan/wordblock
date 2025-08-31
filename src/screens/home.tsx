import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ProgressSummary } from "widgets";
import { blockingService, usageTrackingService } from "shared/lib/services";
import React, { useEffect, useState } from "react";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    usageTrackingService.startSession('Home');
    
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    
    return () => {
      // End session when component unmounts
      usageTrackingService.endCurrentSession();
      clearInterval(interval);
    };
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      usageTrackingService.startSession('Home');
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const handleViewStatistics = () => {
    usageTrackingService.startSession('Statistics');
    navigation.navigate('Statistics' as never);
  };

  const handleStartLearning = () => {
    usageTrackingService.startSession('WordList');
    navigation.navigate('WordList' as never);
  };

  const handleSettings = () => {
    usageTrackingService.startSession('Settings');
    navigation.navigate('Settings' as never);
  };

  const handleTestBlock = async () => {
    try {
      await blockingService.simulateBlock();
      usageTrackingService.startSession('Block');
      navigation.navigate('Block' as never);
    } catch (error) {
      console.error('Failed to trigger test block:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>WordBlock</Text>
            <Text style={styles.subtitle}>Learn words while managing screen time</Text>
            <View style={styles.headerDecoration} />
          </View>
        </View>
        
        {/* Progress Summary Card */}
        <View style={styles.progressSection}>
          <ProgressSummary 
            key={refreshKey}
            onPress={handleViewStatistics}
            compact={true}
          />
        </View>
        
        {/* Main Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Get Started</Text>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartLearning}
            activeOpacity={0.9}
          >
            <View style={styles.primaryButtonContent}>
              <View style={styles.primaryButtonIcon}>
                <Text style={styles.primaryButtonIconText}>📚</Text>
              </View>
              <View style={styles.primaryButtonTextContainer}>
                <Text style={styles.primaryButtonText}>Start Learning</Text>
                <Text style={styles.primaryButtonSubtext}>Browse and learn new words</Text>
              </View>
              <View style={styles.primaryButtonArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.secondaryActionsGrid}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleViewStatistics}
              activeOpacity={0.9}
            >
              <View style={styles.secondaryButtonIcon}>
                <Text style={styles.secondaryButtonIconText}>📊</Text>
              </View>
              <Text style={styles.secondaryButtonText}>Statistics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSettings}
              activeOpacity={0.9}
            >
              <View style={styles.secondaryButtonIcon}>
                <Text style={styles.secondaryButtonIconText}>⚙️</Text>
              </View>
              <Text style={styles.secondaryButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestBlock}
            activeOpacity={0.8}
          >
            <Text style={styles.testButtonText}>🧪 Test Block Flow</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              Track your progress and build better screen time habits
            </Text>
            <View style={styles.footerDecoration} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1C1C1E',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  headerDecoration: {
    width: 60,
    height: 4,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginTop: 8,
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButtonIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  primaryButtonIconText: {
    fontSize: 24,
  },
  primaryButtonTextContainer: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  primaryButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  primaryButtonArrow: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  secondaryActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  secondaryButtonIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonIconText: {
    fontSize: 20,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    letterSpacing: -0.2,
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  testButton: {
    backgroundColor: '#FF9500',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: -0.2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  footerDecoration: {
    width: 40,
    height: 3,
    backgroundColor: '#E5E5EA',
    borderRadius: 1.5,
  },
});

export default HomeScreen;