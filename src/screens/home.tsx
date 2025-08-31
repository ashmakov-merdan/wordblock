import { Text, View, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ProgressSummary } from "widgets";
import { blockingService } from "shared/lib/services";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleViewStatistics = () => {
    navigation.navigate('Statistics' as never);
  };

  const handleStartLearning = () => {
    navigation.navigate('WordList' as never);
  };

  const handleSettings = () => {
    navigation.navigate('Settings' as never);
  };

  const handleTestBlock = async () => {
    try {
      await blockingService.simulateBlock();
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
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSettings}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Settings</Text>
          </TouchableOpacity>

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