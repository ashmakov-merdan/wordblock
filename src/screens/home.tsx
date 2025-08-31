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
    // Start tracking usage when home screen loads
    usageTrackingService.startSession('Home');
    
    // Refresh progress summary every 30 seconds to keep time usage updated
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
        <View style={styles.header}>
          <Text style={styles.title}>WordBlock</Text>
          <Text style={styles.subtitle}>Learn words while managing screen time</Text>
        </View>
        
        <ProgressSummary 
          key={refreshKey}
          onPress={handleViewStatistics}
          compact={true}
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartLearning}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Start Learning</Text>
            <Text style={styles.primaryButtonSubtext}>Browse and learn new words</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleViewStatistics}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Statistics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSettings}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestBlock}
            activeOpacity={0.8}
          >
            <Text style={styles.testButtonText}>Test Block Flow</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Track your progress and build better screen time habits
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
    color: '#1C1C1E',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 0,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  testButton: {
    backgroundColor: '#FF9500',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  testButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    padding: 24,
    paddingTop: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
});

export default HomeScreen;