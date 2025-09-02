import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Button } from "shared/ui";
import { Speaker } from "shared/ui";
import { useNavigation } from "@react-navigation/native";
import { theme } from "shared/theme";
import { useWordsStore } from "entities/words";
import { IWord, WORD_DIFFICULTY } from "entities/words/model";
import { BookOpenIcon } from "phosphor-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LearningScreen = () => {
  const navigation = useNavigation();
  const { getWordsForStudy } = useWordsStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState<IWord[]>([]);

  useEffect(() => {
    const studyWords = getWordsForStudy(20); // Get 20 words for study
    setWords(studyWords);
  }, [getWordsForStudy]);

  const currentWord = words[currentIndex];

  const handleBackToWords = () => {
    navigation.goBack();
  };

  const goToNextWord = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, words.length]);

  const goToPreviousWord = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const getDifficultyColor = (difficulty: WORD_DIFFICULTY) => {
    switch (difficulty) {
      case WORD_DIFFICULTY.EASY:
        return theme.colors.success[500];
      case WORD_DIFFICULTY.MEDIUM:
        return theme.colors.warning[500];
      case WORD_DIFFICULTY.HARD:
        return theme.colors.error[500];
      default:
        return theme.colors.neutral[500];
    }
  };

  const getDifficultyLabel = (difficulty: WORD_DIFFICULTY) => {
    switch (difficulty) {
      case WORD_DIFFICULTY.EASY:
        return 'Easy';
      case WORD_DIFFICULTY.MEDIUM:
        return 'Medium';
      case WORD_DIFFICULTY.HARD:
        return 'Hard';
      default:
        return 'Unknown';
    }
  };

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.emptyState}>
              <BookOpenIcon size={64} color={theme.semanticColors.textTertiary} />
              <Text style={styles.emptyTitle}>No Words to Study</Text>
              <Text style={styles.emptySubtitle}>
                Add some words to your list to start learning!
              </Text>
              <View style={styles.emptyButtonContainer}>
                <Button
                  title="Back to Words"
                  variant="outlined"
                  color="neutral"
                  onPress={handleBackToWords}
                  size="md"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.section}>
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Learning Session</Text>
              <Text style={styles.headerSubtitle}>
                {currentIndex + 1} of {words.length} words
              </Text>
            </View>
          </View>
        </View>

        {/* Word Card Section */}
        <View style={styles.section}>
          <View style={styles.cardContainer}>
            <View style={styles.wordCard}>
              <View style={styles.wordHeader}>
                <Text style={styles.wordText}>{currentWord?.word}</Text>
                <Speaker word={currentWord?.word || ''} />
              </View>
              
              <View style={styles.difficultyIndicator}>
                <View
                  style={[
                    styles.difficultyDot,
                    { backgroundColor: currentWord ? getDifficultyColor(currentWord.difficulty) : theme.colors.neutral[500] }
                  ]}
                />
                <Text style={[styles.difficultyLabel, { color: currentWord ? getDifficultyColor(currentWord.difficulty) : theme.colors.neutral[500] }]}>
                  {currentWord && getDifficultyLabel(currentWord.difficulty)} Level
                </Text>
              </View>

              <Text style={styles.definitionText}>
                {currentWord?.definition}
              </Text>
            </View>
          </View>
        </View>

        {/* Navigation Buttons Section */}
        <View style={styles.section}>
          <View style={styles.navigationButtons}>
            <Button
              title="Previous"
              variant="outlined"
              color="neutral"
              onPress={goToPreviousWord}
              size="md"
              disabled={currentIndex === 0}
            />
            <Button
              title="Next"
              variant="outlined"
              color="neutral"
              onPress={goToNextWord}
              size="md"
              disabled={currentIndex === words.length - 1}
            />
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentIndex + 1) / words.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(((currentIndex + 1) / words.length) * 100)}% Complete
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  section: {
    padding: theme.spacing[6],
    paddingBottom: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.text.h3,
    color: theme.semanticColors.textPrimary,
    marginBottom: theme.spacing[1],
  },
  headerSubtitle: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.full,
  },
  difficultyText: {
    ...theme.typography.text.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
  },
  wordCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[8],
    width: '100%',
    maxWidth: 400,
    minHeight: 320,
    ...theme.shadows.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    gap: theme.spacing[3],
  },
  wordText: {
    ...theme.typography.text.h2,
    fontFamily: "Inter-SemiBold",
    color: theme.semanticColors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  difficultyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[6],
  },
  difficultyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  difficultyLabel: {
    ...theme.typography.text.bodySmall,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  definitionText: {
    ...theme.typography.text.bodyLarge,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  instructions: {
    alignItems: 'center',
  },
  instructionTitle: {
    ...theme.typography.text.h4,
    color: theme.semanticColors.textPrimary,
    marginBottom: theme.spacing[4],
    textAlign: 'center',
  },
  instructionItems: {
    gap: theme.spacing[3],
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  instructionIcon: {
    fontSize: 24,
  },
  instructionText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textSecondary,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing[4],
  },
  progressContainer: {
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.semanticColors.brand,
    borderRadius: theme.borderRadius.full,
  },
  progressText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing[12],
  },
  emptyTitle: {
    ...theme.typography.text.h2,
    color: theme.semanticColors.textPrimary,
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[3],
    textAlign: 'center',
  },
  emptySubtitle: {
    ...theme.typography.text.bodyLarge,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    lineHeight: 24,
  },
  emptyButtonContainer: {
    width: '100%',
    maxWidth: 200,
  },
});

export default LearningScreen;