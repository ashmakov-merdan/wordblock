import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon
} from 'phosphor-react-native';
import { theme } from "shared/theme";
import { Speaker } from "shared/ui";
import { IWord } from "entities/words/model";
import WordDifficulty from '../word-difficulty';

interface WordCardProps {
  word: IWord;
  onToggleLearned?: (wordId: string) => void;
  showActions?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  onToggleLearned,
  showActions = true
}) => {
  const handleToggleLearned = () => {
    if (onToggleLearned) {
      onToggleLearned(word.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.wordInfo}>
          <Text style={styles.wordText}>{word.word}</Text>
          <WordDifficulty value={word.difficulty} />
        </View>

        {showActions && (
          <View style={styles.wordActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleToggleLearned}
              activeOpacity={0.7}
            >
              {word.isLearned ? (
                <CheckCircleIcon size={20} color={theme.colors.success[500]} weight="fill" />
              ) : (
                <XCircleIcon size={20} color={theme.colors.neutral[400]} weight="regular" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.definitionSection}>
          <Text style={styles.definitionLabel}>Definition</Text>
          <Text style={styles.definitionText} numberOfLines={3}>
            {word.definition}
          </Text>
        </View>

        <View style={styles.speakerSection}>
          <Speaker word={word.word} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <BookOpenIcon size={16} color={theme.colors.neutral[400]} weight="regular" />
            <Text style={styles.metaText}>
              Reviewed {word.reviewCount} times
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[
              styles.statusText,
              { color: word.isLearned ? theme.colors.success[600] : theme.colors.neutral[500] }
            ]}>
              {word.isLearned ? 'Learned' : 'Not learned'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.sm,
    gap: theme.spacing[3]
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
    gap: theme.spacing[2],
  },
  wordInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  wordText: {
    ...theme.typography.text.h4,
    color: theme.semanticColors.textPrimary,
    flex: 1,
  },
  wordActions: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  actionButton: {
    padding: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
  },
  definitionSection: {
    flex: 1,
  },
  definitionLabel: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.textTertiary,
    marginBottom: theme.spacing[1],
    fontWeight: '500',
  },
  definitionText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textSecondary,
  },
  speakerSection: {
    paddingTop: theme.spacing[1],
  },
  footer: {
    marginTop: theme.spacing[2],
    paddingTop: theme.spacing[2],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  metaText: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.textTertiary,
  },
  statusText: {
    ...theme.typography.text.caption,
    fontWeight: '600',
  },
  lastReviewedText: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.textTertiary,
    textAlign: 'right',
  },
});

export default WordCard;

