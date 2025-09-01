import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { storageService } from 'shared/lib/storage';
import { usageTrackingService } from 'shared/lib/services';
import { theme } from 'shared/theme';
import { Word } from 'shared/lib/types';
import { Button } from 'shared/ui';
import {
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  BookOpenIcon,
  ArrowRightIcon,
  XIcon,
} from 'phosphor-react-native';

const LearningScreen = () => {
  const navigation = useNavigation();

  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [hasConfirmedLearning, setHasConfirmedLearning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const MINIMUM_TIME = 20 * 1000; // 20 seconds in milliseconds

  useEffect(() => {
    loadRandomWord();
    setSessionStartTime(Date.now());
    usageTrackingService.startSession('Learning');

    // Simple fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    return () => {
      usageTrackingService.endCurrentSession();
    };
  }, [fadeAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - sessionStartTime;
      setTimeSpent(elapsed);

      if (elapsed >= MINIMUM_TIME && !isCompleted) {
        setIsCompleted(true);
        Vibration.vibrate(100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime, isCompleted, MINIMUM_TIME]);

  const loadRandomWord = async () => {
    try {
      setIsLoading(true);
      const words = await storageService.getWordsByFilter('unlearned');
      if (words.length > 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        setCurrentWord(words[randomIndex]);
      } else {
        const allWords = await storageService.getWords();
        if (allWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * allWords.length);
          setCurrentWord(allWords[randomIndex]);
        }
      }
    } catch (error) {
      console.error('Failed to load random word:', error);
    } finally {
      setIsLoading(false);
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
    if (!currentWord || isTransitioning) return;

    setIsTransitioning(true);

    try {
      await storageService.markWordAsLearned(currentWord.id);
      setHasConfirmedLearning(true);
      Vibration.vibrate(200);

      setTimeout(async () => {
        await loadRandomWord();
        setShowDefinition(false);
        setHasConfirmedLearning(false);
        setIsTransitioning(false);
      }, 500);
    } catch (error) {
      console.error('Failed to mark word as learned:', error);
      setIsTransitioning(false);
    }
  };

  const handleComplete = async () => {
    try {
      const sessionId = Date.now().toString();
      await storageService.endStudySession(
        sessionId,
        currentWord ? [currentWord.id] : [],
        currentWord && showDefinition ? [currentWord.id] : []
      );

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

  if (isLoading || !currentWord) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <BookOpenIcon size={48} color={theme.semanticColors.brand} />
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
          <View style={styles.headerTop}>
            <View style={styles.sessionInfo}>
              <BookOpenIcon size={24} color={theme.semanticColors.brand} />
              <Text style={styles.sessionTitle}>Learning Session</Text>
            </View>
            <View style={styles.timerContainer}>
              <ClockIcon size={18} color={theme.semanticColors.textSecondary} />
              <Text style={styles.timerText}>
                {formatTime(timeSpent)} / {formatTime(MINIMUM_TIME)}
              </Text>
            </View>
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
        </View>

        {/* Word Card */}
        <View style={styles.wordCard}>
          {/* Word Header */}
          <View style={styles.wordHeader}>
            <Text style={styles.wordText}>{currentWord.word}</Text>
            <View style={styles.difficultyContainer}>
              <Text style={styles.difficultyText}>
                {currentWord.difficulty}
              </Text>
            </View>
          </View>

          {/* Content Area */}
          <View style={styles.contentArea}>
            {showDefinition ? (
              <View style={styles.definitionSection}>
                <Text style={styles.definitionLabel}>Definition:</Text>
                <Text style={styles.definitionText}>{currentWord.definition}</Text>

                <Button
                  title={hasConfirmedLearning ? "Word Learned! ✓" : "I Learned This Word"}
                  variant="success"
                  leftIcon={<CheckCircleIcon size={20} color="white" />}
                  onPress={handleMarkAsLearned}
                  style={styles.learnedButton}
                  disabled={hasConfirmedLearning || isTransitioning}
                  loading={isTransitioning}
                  size="large"
                />
              </View>
            ) : (
              <View style={styles.showDefinitionSection}>
                <Button
                  title="Show Definition"
                  variant="primary"
                  leftIcon={<EyeIcon size={20} color="white" />}
                  onPress={handleShowDefinition}
                  style={styles.showDefinitionButton}
                  disabled={isTransitioning}
                  size="large"
                />
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={isCompleted ? 'Complete Learning' : 'Complete Learning (20s required)'}
            variant={isCompleted ? "success" : "outline"}
            leftIcon={isCompleted ? <ArrowRightIcon size={20} color={theme.semanticColors.success} /> : undefined}
            onPress={handleComplete}
            disabled={!isCompleted || isTransitioning}
            style={styles.primaryButton}
            size="large"
          />

          <Button
            title="Skip Session"
            variant="ghost"
            leftIcon={<XIcon size={20} color={theme.semanticColors.textSecondary} />}
            onPress={handleSkip}
            style={styles.secondaryButton}
            disabled={isTransitioning}
            size="medium"
          />
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
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[4],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textSecondary,
    marginTop: theme.spacing[3],
  },
  header: {
    marginBottom: theme.spacing[6],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  sessionTitle: {
    ...theme.typography.text.h4,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
    backgroundColor: theme.semanticColors.surface,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.lg,
  },
  timerText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  progressContainer: {
    gap: theme.spacing[2],
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.semanticColors.borderLight,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.semanticColors.success,
    borderRadius: theme.borderRadius.full,
  },
  progressText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
  wordCard: {
    flex: 1,
    backgroundColor: theme.semanticColors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[6],
  },
  wordHeader: {
    marginBottom: theme.spacing[4],
    alignItems: 'center',
  },
  wordText: {
    ...theme.typography.text.h1,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  difficultyContainer: {
    backgroundColor: theme.semanticColors.brandLight,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
  },
  difficultyText: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.brand,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  definitionSection: {
    flex: 1,
    gap: theme.spacing[4],
  },
  definitionLabel: {
    ...theme.typography.text.h4,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  definitionText: {
    ...theme.typography.text.bodyLarge,
    color: theme.semanticColors.textPrimary,
    lineHeight: 28,
    flex: 1,
  },
  learnedButton: {
    marginTop: 'auto',
  },
  showDefinitionSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showDefinitionButton: {
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    alignSelf: 'center',
  },
});

export default LearningScreen;
