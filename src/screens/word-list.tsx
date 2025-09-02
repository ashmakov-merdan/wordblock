import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { MagnifyingGlassIcon } from 'phosphor-react-native';
import { Input } from 'shared/ui';
import { theme } from 'shared/theme';
import { useWordsStore } from 'entities/words';
import { WORD_DIFFICULTY, WordFilters } from 'entities/words/model';
import { WordList, FiltersWord } from 'features/words';

const WordListScreen = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<WordFilters>(WordFilters.ALL);
  const [selectedDifficulty, setSelectedDifficulty] = useState<WORD_DIFFICULTY | 'all'>('all');

  const {
    words,
    searchWords,
    getWordsByFilter,
  } = useWordsStore();

  const filteredWords = useMemo(() => {
    let filtered = words;

    if (selectedFilter !== WordFilters.ALL) {
      filtered = getWordsByFilter(selectedFilter);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(word => word.difficulty === selectedDifficulty);
    }

    if (searchQuery.trim()) {
      const searchResults = searchWords(searchQuery);
      filtered = filtered.filter(word =>
        searchResults.some(searchWord => searchWord.id === word.id)
      );
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }, [words, selectedFilter, selectedDifficulty, searchQuery, getWordsByFilter, searchWords]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={{ flex: 1 }}>
          <Input
            startIcon={MagnifyingGlassIcon}
            type={'default'}
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder='Search words'
          />
        </View>

        <FiltersWord 
          selectedFilter={selectedFilter}
          selectedDifficulty={selectedDifficulty}
          onFilterChange={setSelectedFilter}
          onDifficultyChange={setSelectedDifficulty}
        />
      </View>

      <View style={styles.resultsCount}>
        <Text style={styles.resultsCountText}>
          {filteredWords.length} word{filteredWords.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <WordList words={filteredWords} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    padding: theme.spacing[4],
    backgroundColor: 'white',
  },
  resultsCount: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  resultsCountText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
  },
});

export default WordListScreen;