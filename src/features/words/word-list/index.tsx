import { FlatList, StyleSheet, View, Text } from "react-native";
import { theme } from "shared/theme";
import WordCard from "features/words/word-card";
import { IWord } from "entities/words";
import { useWordsStore } from "entities/words/store";
import { FC } from "react";

const Separator = () => <View style={styles.separator} />;

interface WordListProps {
  words: IWord[];
}

const WordList: FC<WordListProps> = ({ words }) => {
  const markWordAsLearned = useWordsStore(state => state.markWordAsLearned);
  const updateWord = useWordsStore(state => state.updateWord);

  const handleToggleLearned = (wordId: string) => {
    const word = words.find(w => w.id === wordId);
    if (word) {
      if (word.isLearned) {
        updateWord(wordId, { isLearned: false });
      } else {
        markWordAsLearned(wordId);
      }
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No words found</Text>
    </View>
  );

  return (
    <FlatList
      data={words}
      renderItem={({ item: word }) => (
        <WordCard
          word={word}
          onToggleLearned={handleToggleLearned}
          showActions={true}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.wordList}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
      ItemSeparatorComponent={Separator}
    />
  )
};

const styles = StyleSheet.create({
  wordList: {
    padding: theme.spacing[4],
  },
  separator: {
    height: 16,
  },
  emptyState: {
    padding: theme.spacing[4],
    alignItems: 'center',
  },
  emptyStateText: {
    color: theme.colors.neutral[500],
    fontSize: 16,
  }
});

export default WordList;