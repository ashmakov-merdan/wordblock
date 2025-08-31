import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { storageService } from 'shared/lib/storage';
import { theme } from 'shared/theme';
import { Word } from 'shared/lib/types';

type FilterType = 'all' | 'learned' | 'unlearned';

const WordListScreen = () => {
  const navigation = useNavigation();
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWords();
  }, []);

  // Refresh words when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWords();
    });

    return unsubscribe;
  }, [navigation]);

  const loadWords = async () => {
    try {
      setLoading(true);
      const allWords = await storageService.getWords();
      setWords(allWords);
    } catch (error) {
      console.error('Failed to load words:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterWords = useCallback(() => {
    let filtered = words;

    // Apply filter
    switch (currentFilter) {
      case 'learned':
        filtered = filtered.filter(word => word.isLearned);
        break;
      case 'unlearned':
        filtered = filtered.filter(word => !word.isLearned);
        break;
      default:
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(word =>
        word.word.toLowerCase().includes(query) ||
        word.definition.toLowerCase().includes(query)
      );
    }

    setFilteredWords(filtered);
  }, [words, searchQuery, currentFilter]);

  useEffect(() => {
    filterWords();
  }, [filterWords]);

  const handleMarkAsLearned = async (wordId: string) => {
    try {
      await storageService.markWordAsLearned(wordId);
      await loadWords(); // Reload words to update the list
    } catch (error) {
      console.error('Failed to mark word as learned:', error);
    }
  };

  const handleDeleteWord = (word: Word) => {
    Alert.alert(
      'Delete Word',
      `Are you sure you want to delete "${word.word}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.deleteWord(word.id);
              await loadWords();
            } catch (error) {
              console.error('Failed to delete word:', error);
            }
          },
        },
      ]
    );
  };

  const renderWordItem = ({ item }: { item: Word }) => (
    <View style={styles.wordItem}>
      <View style={styles.wordHeader}>
        <Text style={styles.wordText}>{item.word}</Text>
        <View style={styles.wordActions}>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(item.difficulty) }
          ]}>
            <Text style={styles.difficultyText}>
              {item.difficulty.toUpperCase()}
            </Text>
          </View>
          {item.isLearned && (
            <View style={styles.learnedBadge}>
              <Text style={styles.learnedText}>✓</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={styles.definitionText}>{item.definition}</Text>
      
      <View style={styles.wordFooter}>
        <Text style={styles.wordMeta}>
          Reviewed {item.reviewCount} times
          {item.lastReviewed && ` • Last: ${new Date(item.lastReviewed).toLocaleDateString()}`}
        </Text>
        
        <View style={styles.wordButtons}>
          {!item.isLearned && (
            <TouchableOpacity
              style={styles.learnButton}
              onPress={() => handleMarkAsLearned(item.id)}
            >
              <Text style={styles.learnButtonText}>Mark Learned</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteWord(item)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return theme.semanticColors.success;
      case 'medium':
        return theme.semanticColors.warning;
      case 'hard':
        return theme.semanticColors.error;
      default:
        return theme.semanticColors.brand;
    }
  };

  const FilterButton = ({ type, label }: { type: FilterType; label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        currentFilter === type && styles.filterButtonActive
      ]}
      onPress={() => setCurrentFilter(type)}
    >
      <Text style={[
        styles.filterButtonText,
        currentFilter === type && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Word List</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddWord' as never)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search words or definitions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.semanticColors.textSecondary}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <FilterButton type="all" label="All" />
        <FilterButton type="unlearned" label="Unlearned" />
        <FilterButton type="learned" label="Learned" />
      </View>

      {/* Word Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredWords.length} of {words.length} words
        </Text>
      </View>

      {/* Word List */}
      <FlatList
        data={filteredWords}
        renderItem={renderWordItem}
        keyExtractor={(item) => item.id}
        style={styles.wordList}
        contentContainerStyle={styles.wordListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading words...' : 'No words found'}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddWord' as never)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.semanticColors.borderLight,
  },
  backButton: {
    padding: theme.spacing[2],
  },
  backButtonText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.brand,
    fontWeight: theme.typography.fontWeight.medium,
  },
  headerTitle: {
    ...theme.typography.text.h3,
    color: theme.semanticColors.textPrimary,
  },
  addButton: {
    backgroundColor: theme.semanticColors.brand,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
  },
  addButtonText: {
    ...theme.typography.text.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold,
  },
  searchContainer: {
    padding: theme.spacing[6],
    paddingBottom: theme.spacing[3],
  },
  searchInput: {
    backgroundColor: theme.semanticColors.surface,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.semanticColors.borderLight,
    ...theme.typography.text.body,
    color: theme.semanticColors.textPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[3],
    gap: theme.spacing[2],
  },
  filterButton: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.semanticColors.borderLight,
    backgroundColor: theme.semanticColors.surface,
  },
  filterButtonActive: {
    backgroundColor: theme.semanticColors.brand,
    borderColor: theme.semanticColors.brand,
  },
  filterButtonText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  countContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[3],
  },
  countText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
  },
  wordList: {
    flex: 1,
  },
  wordListContent: {
    padding: theme.spacing[6],
    paddingTop: 0,
  },
  wordItem: {
    backgroundColor: theme.semanticColors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
    ...theme.shadows.sm,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[2],
  },
  wordText: {
    ...theme.typography.text.h4,
    color: theme.semanticColors.textPrimary,
    flex: 1,
    marginRight: theme.spacing[2],
  },
  wordActions: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  difficultyText: {
    ...theme.typography.text.caption,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold,
  },
  learnedBadge: {
    backgroundColor: theme.semanticColors.success,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  definitionText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textPrimary,
    lineHeight: 20,
    marginBottom: theme.spacing[3],
  },
  wordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordMeta: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.textSecondary,
    flex: 1,
  },
  wordButtons: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  learnButton: {
    backgroundColor: theme.semanticColors.success,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
  },
  learnButtonText: {
    ...theme.typography.text.caption,
    color: 'white',
    fontWeight: theme.typography.fontWeight.medium,
  },
  deleteButton: {
    backgroundColor: theme.semanticColors.error,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
  },
  deleteButtonText: {
    ...theme.typography.text.caption,
    color: 'white',
    fontWeight: theme.typography.fontWeight.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing[8],
  },
  emptyText: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing[6],
    right: theme.spacing[6],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.semanticColors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default WordListScreen;
