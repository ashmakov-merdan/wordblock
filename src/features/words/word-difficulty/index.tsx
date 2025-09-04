import { WORD_DIFFICULTY } from "entities/words";
import { StarHalfIcon, StarIcon } from "phosphor-react-native";
import { FC, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "shared/theme";

interface WordDifficultyProps {
  value: WORD_DIFFICULTY
};

const WordDifficulty: FC<WordDifficultyProps> = ({ value }) => {
  const difficulty = useMemo(() => {
    switch (value) {
      case WORD_DIFFICULTY.EASY:
        return {
          icon: <StarIcon size={16} color={theme.colors.success[500]} weight="fill" />,
          color: theme.colors.success[100],
          label: 'Easy'
        }
      case WORD_DIFFICULTY.MEDIUM:
        return {
          icon: <StarHalfIcon size={16} color={theme.colors.warning[500]} weight="fill" />,
          color: theme.colors.warning[100],
          label: 'Medium'
        }
      case WORD_DIFFICULTY.HARD:
        return {
          icon: <StarIcon size={16} color={theme.colors.error[500]} weight="fill" />,
          color: theme.colors.error[100],
          label: 'Hard'
        }
      default:
        return {
          label: 'Unknown',
          color: theme.colors.neutral[100],
          icon: null
        }
    }
  }, [value]);

  return (
    <View style={[styles.badge, { backgroundColor: difficulty.color }]}>
      {difficulty.icon}
      <Text style={styles.text}>{difficulty.label}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing[1],
  },
  text: {
    ...theme.typography.text.caption,
    fontFamily: 'Inter-Medium',
    color: theme.semanticColors.textSecondary,
  }
})

WordDifficulty.displayName = 'WordDifficulty';

export default WordDifficulty;