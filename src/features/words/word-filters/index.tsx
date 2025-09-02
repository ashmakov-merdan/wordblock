import { FunnelIcon } from "phosphor-react-native";
import { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Button, Sheet, useToggleSheet } from "shared/ui";
import { theme } from "shared/theme";
import { WordFilters, WORD_DIFFICULTY } from "entities/words/model";
import difficulties from "entities/words/configs/difficulties";

interface FiltersWordProps {
  selectedFilter: WordFilters;
  selectedDifficulty: WORD_DIFFICULTY | 'all';
  onFilterChange: (filter: WordFilters) => void;
  onDifficultyChange: (difficulty: WORD_DIFFICULTY | 'all') => void;
}

const FiltersWord: FC<FiltersWordProps> = ({
  selectedFilter,
  selectedDifficulty,
  onFilterChange,
  onDifficultyChange,
}) => {
  const { bottomSheetRef, onOpenSheet, onCloseSheet } = useToggleSheet();

  const statusFilters = [
    { value: WordFilters.ALL, label: 'All' },
    { value: WordFilters.LEARNED, label: 'Learned' },
    { value: WordFilters.UNLEARNED, label: 'Unlearned' },
  ];

  const difficultyFilters = [
    { value: 'all' as const, label: 'All' },
    ...difficulties,
  ];

  const handleFilterChange = (filter: WordFilters) => {
    onFilterChange(filter);
  };

  const handleDifficultyChange = (difficulty: WORD_DIFFICULTY | 'all') => {
    onDifficultyChange(difficulty);
  };

  return (
    <>
      <Button
        icon={FunnelIcon}
        isIconOnly
        size={'md'}
        color={'neutral'}
        variant={'ghost'}
        onPress={onOpenSheet}
      />
      <Sheet ref={bottomSheetRef} onClose={onCloseSheet} display="Filters">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.wrapper}>
            {/* Status Filters */}
            <View>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.chipContainer}>
                {statusFilters.map((filter) => (
                  <TouchableOpacity
                    key={filter.value}
                    style={[
                      styles.chip,
                      selectedFilter === filter.value && styles.chipActive
                    ]}
                    onPress={() => handleFilterChange(filter.value)}
                  >
                    <Text style={[
                      styles.chipText,
                      selectedFilter === filter.value && styles.chipTextActive
                    ]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Difficulty Filters */}
            <View>
              <Text style={styles.sectionTitle}>Difficulty</Text>
              <View style={styles.chipContainer}>
                {difficultyFilters.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty.value}
                    style={[
                      styles.chip,
                      selectedDifficulty === difficulty.value && styles.chipActive
                    ]}
                    onPress={() => handleDifficultyChange(difficulty.value)}
                  >
                    <Text style={[
                      styles.chipText,
                      selectedDifficulty === difficulty.value && styles.chipTextActive
                    ]}>
                      {difficulty.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </Sheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: theme.spacing[4],
  },
  wrapper: {
    gap: theme.spacing[4],
  },
  sectionTitle: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    marginBottom: theme.spacing[3],
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  chip: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  chipActive: {
    backgroundColor: theme.colors.primary[100],
    borderColor: theme.colors.primary[300],
  },
  chipText: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.textSecondary,
  },
  chipTextActive: {
    color: theme.colors.primary[700],
    fontWeight: '600',
  },
});

export default FiltersWord;