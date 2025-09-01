import { useCallback, useMemo, useState } from "react";
import { WORD_DIFFICULTY, WordData } from "../model";
import { Alert } from "react-native";
import storageService from "shared/lib/storage";
import { useNavigation } from "@react-navigation/native";

const DEFAULT_VALUES: WordData = {
  word: '',
  definition: '',
  difficulty: WORD_DIFFICULTY.MEDIUM,
  isLearned: false,
}

const useCreateWord = () => {
  const navigation = useNavigation();
  const [values, setValues] = useState<WordData>(DEFAULT_VALUES);
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = useCallback((): string | null => {
    if (!values.word.trim()) {
      return 'Please enter a word';
    };

    if (!values.definition.trim()) {
      return 'Please enter a definition';
    };

    if (values.word.trim().length < 2) {
      return 'Word must be at least 2 characters long';
    };

    if (values.definition.trim().length < 10) {
      return 'Definition must be at least 10 characters long';
    };

    return null;
  }, [values]);

  const onChange = useCallback((label: keyof WordData, value: unknown) => {
    switch (label) {
      case 'word':
        setValues((prev) => ({ ...prev, word: value as string }));
        break;
      case 'definition':
        setValues((prev) => ({ ...prev, definition: value as string }));
        break;
      case 'difficulty':
        setValues((prev) => ({ ...prev, difficulty: value as WORD_DIFFICULTY }));
        break;
      default:
        return;
    }
  }, []);


  const handleAdd = useCallback(async () => {
    const isValid = validateForm();

    if (isValid) {
      Alert.alert('Validation Error', isValid);
      return;
    };

    setLoading(true);

    try {
      const newWord = await storageService.addWord({
        word: values.word.trim(),
        definition: values.definition.trim(),
        isLearned: false,
        difficulty: values.difficulty
      });

      Alert.alert(
        'Success!',
        `"${newWord.word}" has been added to your word list`,
        [
          {
            text: "Add another",
            onPress: () => setValues(DEFAULT_VALUES)
          },
          {
            text: "View words",
            onPress: () => navigation.navigate('WordList' as never)
          }
        ]
      );
    } catch (error) {
      console.error('Failed to add word: ', error);
      Alert.alert('Error', 'Failed to add word. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigation, validateForm, values]);

  const handleCancel = useCallback(() => {
    if (values.word.trim() || values.definition.trim()) {
      Alert.alert(
        'Discard changes?',
        `You have unsaved changes. Are you sure you want to discard them?`,
        [
          { text: 'Keep editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      )
    } else {
      navigation.goBack();
    }
  }, [navigation, values]);

  const isFormValid = useMemo(() => values.word.trim() && values.definition.trim() && !loading, [values, loading]);

  return { loading, values, isFormValid, handleAdd, handleCancel, onChange }
};

export default useCreateWord;