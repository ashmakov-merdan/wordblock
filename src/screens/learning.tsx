import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { storageService } from 'shared/lib/storage';
import { usageTrackingService } from 'shared/lib/services';
import { theme } from 'shared/theme';
import { Word } from 'shared/lib/types';

const LearningScreen = () => {
  const navigation = useNavigation();

  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const MINIMUM_TIME = 20 * 1000; // 20 seconds in milliseconds

  useEffect(() => {
    loadRandomWord();
    setSessionStartTime(Date.now());
    usageTrackingService.startSession('Learning');
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    return () => {
      usageTrackingService.endCurrentSession();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - sessionStartTime;
      setTimeSpent(elapsed);
      
      if (elapsed >= MINIMUM_TIME && !isCompleted) {
        setIsCompleted(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime, isCompleted]);

  const loadRandomWord = async () => {
    try {
      const words = await storageService.getWordsByFilter('unlearned');
      if (words.length > 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        setCurrentWord(words[randomIndex]);
      } else {
        // If no unlearned words, get any word
        const allWords = await storageService.getWords();
        if (allWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * allWords.length);
          setCurrentWord(allWords[randomIndex]);
        }
      }
    } catch (error) {
      console.error('Failed to load random word:', error);
    }
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    return `${seconds}s`;
  };

  const handleShowDefinition = () => {
    setShowDefinition(true);
  };

  const handleMarkAsLearned = async () => {
    if (!currentWord) return;
    
    try {
      await storageService.markWordAsLearned(currentWord.id);
      Alert.alert('Success!', 'Word marked as learned!');
      loadRandomWord();
      setShowDefinition(false);
    } catch (error) {
      console.error('Failed to mark word as learned:', error);
    }
  };

  const handleComplete = async () => {
    try {
      // End study session
      const sessionId = Date.now().toString();
      await storageService.endStudySession(
        sessionId,
        currentWord ? [currentWord.id] : [],
        currentWord && showDefinition ? [currentWord.id] : []
      );

      // Reset blocking settings
      await storageService.updateBlockingSettings({
        lastBlockTime: undefined,
      });

      Alert.alert(
        'Learning Complete!',
        'Great job! You can now continue using your device.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Home' as never),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to complete learning session:', error);
    }
  };

  const handleSkip = () => {
    if (timeSpent < MINIMUM_TIME) {
      Alert.alert(
        'Minimum Time Required',
        `Please spend at least ${MINIMUM_TIME / 1000} seconds learning before continuing.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    Alert.alert(
      'Skip Learning?',
      'Are you sure you want to skip this learning session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', style: 'destructive', onPress: handleComplete },
      ]
    );
  };

  if (!currentWord) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading word...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Learning Session</Text>
          <Text style={styles.subtitle}>
            Time spent: {formatTime(timeSpent)} / {formatTime(MINIMUM_TIME)}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min((timeSpent / MINIMUM_TIME) * 100, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {timeSpent >= MINIMUM_TIME ? 'Ready to continue!' : 'Keep learning...'}
          </Text>
        </View>

        {/* Word Card */}
        <ScrollView style={styles.wordCard} showsVerticalScrollIndicator={false}>
          <View style={styles.wordHeader}>
            <Text style={styles.wordText}>{currentWord.word}</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>
                {currentWord.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          {showDefinition ? (
            <View style={styles.definitionContainer}>
              <Text style={styles.definitionLabel}>Definition:</Text>
              <Text style={styles.definitionText}>{currentWord.definition}</Text>
              
              <TouchableOpacity
                style={styles.learnedButton}
                onPress={handleMarkAsLearned}
                activeOpacity={0.8}
              >
                <Text style={styles.learnedButtonText}>I Learned This Word</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.showDefinitionButton}
              onPress={handleShowDefinition}
              activeOpacity={0.8}
            >
              <Text style={styles.showDefinitionText}>Show Definition</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !isCompleted && styles.primaryButtonDisabled
            ]}
            onPress={handleComplete}
            disabled={!isCompleted}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {isCompleted ? 'Complete Learning' : 'Complete Learning (20s required)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing[6],
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
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  title: {
    ...theme.typography.text.h2,
    color: theme.semanticColors.textPrimary,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textSecondary,
  },
  progressContainer: {
    marginBottom: theme.spacing[6],
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.semanticColors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing[2],
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.semanticColors.success,
    borderRadius: 4,
  },
  progressText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
  },
  wordCard: {
    flex: 1,
    backgroundColor: theme.semanticColors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[6],
    ...theme.shadows.md,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  wordText: {
    ...theme.typography.text.h1,
    color: theme.semanticColors.textPrimary,
    flex: 1,
    marginRight: theme.spacing[3],
  },
  difficultyBadge: {
    backgroundColor: theme.semanticColors.brand,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  difficultyText: {
    ...theme.typography.text.caption,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold,
  },
  definitionContainer: {
    flex: 1,
  },
  definitionLabel: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    marginBottom: theme.spacing[2],
    fontWeight: theme.typography.fontWeight.medium,
  },
  definitionText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textPrimary,
    lineHeight: 24,
    marginBottom: theme.spacing[4],
  },
  learnedButton: {
    backgroundColor: theme.semanticColors.success,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  learnedButtonText: {
    ...theme.typography.text.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold,
  },
  showDefinitionButton: {
    backgroundColor: theme.semanticColors.brand,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  showDefinitionText: {
    ...theme.typography.text.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold,
  },
  buttonContainer: {
    gap: theme.spacing[3],
  },
  primaryButton: {
    backgroundColor: theme.semanticColors.success,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: theme.semanticColors.borderLight,
  },
  primaryButtonText: {
    ...theme.typography.text.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.semanticColors.borderLight,
  },
  secondaryButtonText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default LearningScreen;
