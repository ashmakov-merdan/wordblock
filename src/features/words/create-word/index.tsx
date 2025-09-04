import { BookOpenIcon, PlusIcon, StarIcon } from "phosphor-react-native";
import { FC, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { theme } from "shared/theme";
import { Button, Input, Sheet, useToggleSheet } from "shared/ui";
import { WORD_DIFFICULTY } from "entities/words/model";
import { useWordsStore } from "entities/words/store";

const CreateWord: FC = () => {
  const { bottomSheetRef, onOpenSheet, onCloseSheet } = useToggleSheet();
  const [ word, setWord ] = useState<string>('');
  const [ definition, setDefinition ] = useState<string>('');
  const [ difficulty, setDifficulty ] = useState<WORD_DIFFICULTY>(WORD_DIFFICULTY.MEDIUM);
  const [ error, setError ] = useState<string>('');
  
  const addWord = useWordsStore(state => state.addWord);

  const handleCreate = () => {
    // Validate inputs
    if (!word.trim()) {
      setError('Word is required');
      return;
    }
    if (!definition.trim()) {
      setError('Definition is required');
      return;
    }

    // Add the word
    addWord({
      word: word.trim(),
      definition: definition.trim(),
      difficulty,
      isLearned: false,
    });

    // Reset form and close sheet
    setWord('');
    setDefinition('');
    setDifficulty(WORD_DIFFICULTY.MEDIUM);
    setError('');
    onCloseSheet();
  };

  const handleDifficultyChange = (newDifficulty: WORD_DIFFICULTY) => {
    setDifficulty(newDifficulty);
  };

  return (
    <>
      <Button
        icon={PlusIcon}
        isIconOnly
        variant={'solid'}
        color={'primary'}
        size={'sm'}
        shape='rounded'
        onPress={onOpenSheet}
      />
      <Sheet ref={bottomSheetRef} display="Create new word" onClose={onCloseSheet}>
        <View style={styles.content}>
          <Input
            type={'bottomSheet'}
            startIcon={BookOpenIcon}
            placeholder={'Enter word'}
            value={word}
            onChange={(value) => {
              setWord(value);
              setError('');
            }}
            keyboardType='default'
          />
          <Input
            type="bottomSheet"
            placeholder="Definition"
            value={definition}
            onChange={(value) => {
              setDefinition(value);
              setError('');
            }}
            keyboardType='default'
            multiline
            numberOfLines={5}
          />
          <View style={styles.difficultySelector}>
            <Text style={styles.difficultyLabel}>Difficulty:</Text>
            <View style={styles.difficultyButtons}>
              {Object.values(WORD_DIFFICULTY)
                .filter((v): v is WORD_DIFFICULTY => !isNaN(Number(v)))
                .map((value) => (
                  <Button
                    key={value}
                    title={WORD_DIFFICULTY[value].toLowerCase()}
                    color={difficulty === value ? 'primary' : 'neutral'}
                    size="sm"
                    variant={difficulty === value ? 'solid' : 'outlined'}
                    onPress={() => handleDifficultyChange(value)}
                    icon={StarIcon}
                  />
                ))}
            </View>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button 
            title="Create"
            color={'success'}
            onPress={handleCreate}
          />
        </View>
      </Sheet>
    </>
  )
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingTop: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[4]
  },
  difficultySelector: {
    gap: theme.spacing[2]
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.neutral[700]
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: theme.spacing[2]
  },
  errorText: {
    color: theme.colors.error[500],
    fontSize: 14
  }
})

export default CreateWord;