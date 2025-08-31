import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { storageService } from 'shared/lib/storage';
import { theme } from 'shared/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

type Difficulty = 'easy' | 'medium' | 'hard';

const AddWordScreen = () => {
  const navigation = useNavigation();
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [loading, setLoading] = useState(false);

  const difficulties: { value: Difficulty; label: string; color: string }[] = [
    { value: 'easy', label: 'Easy', color: theme.semanticColors.success },
    { value: 'medium', label: 'Medium', color: theme.semanticColors.warning },
    { value: 'hard', label: 'Hard', color: theme.semanticColors.error },
  ];

  const validateForm = (): string | null => {
    if (!word.trim()) {
      return 'Please enter a word';
    }
    if (!definition.trim()) {
      return 'Please enter a definition';
    }
    if (word.trim().length < 2) {
      return 'Word must be at least 2 characters long';
    }
    if (definition.trim().length < 10) {
      return 'Definition must be at least 10 characters long';
    }
    return null;
  };

  const handleAddWord = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    setLoading(true);
    try {
      const newWord = await storageService.addWord({
        word: word.trim(),
        definition: definition.trim(),
        isLearned: false,
        difficulty,
      });

      Alert.alert(
        'Success!',
        `"${newWord.word}" has been added to your word list.`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              setWord('');
              setDefinition('');
              setDifficulty('medium');
            },
          },
          {
            text: 'View Words',
            onPress: () => navigation.navigate('WordList' as never),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to add word:', error);
      Alert.alert('Error', 'Failed to add word. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (word.trim() || definition.trim()) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const isFormValid = word.trim() && definition.trim() && !loading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleCancel}
          >
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Word</Text>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !isFormValid && styles.saveButtonDisabled
            ]}
            onPress={handleAddWord}
            disabled={!isFormValid}
          >
            <Text style={[
              styles.saveButtonText,
              !isFormValid && styles.saveButtonTextDisabled
            ]}>
              {loading ? 'Adding...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Word Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Word *</Text>
            <TextInput
              style={styles.textInput}
              value={word}
              onChangeText={setWord}
              placeholder="Enter the word you want to learn"
              placeholderTextColor={theme.semanticColors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={50}
            />
            <Text style={styles.characterCount}>
              {word.length}/50 characters
            </Text>
          </View>

          {/* Definition Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Definition *</Text>
            <TextInput
              style={[styles.textInput, styles.definitionInput]}
              value={definition}
              onChangeText={setDefinition}
              placeholder="Enter the definition or meaning of the word"
              placeholderTextColor={theme.semanticColors.textSecondary}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {definition.length}/500 characters
            </Text>
          </View>

          {/* Difficulty Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Difficulty Level</Text>
            <Text style={styles.inputDescription}>
              Choose the difficulty level for this word
            </Text>
            <View style={styles.difficultyContainer}>
              {difficulties.map((diff) => (
                <TouchableOpacity
                  key={diff.value}
                  style={[
                    styles.difficultyButton,
                    difficulty === diff.value && styles.difficultyButtonSelected,
                    { borderColor: diff.color }
                  ]}
                  onPress={() => setDifficulty(diff.value)}
                >
                  <View style={[
                    styles.difficultyIndicator,
                    { backgroundColor: diff.color }
                  ]} />
                  <Text style={[
                    styles.difficultyText,
                    difficulty === diff.value && styles.difficultyTextSelected
                  ]}>
                    {diff.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips for Adding Words</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Keep definitions clear and concise</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Include example usage when helpful</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Choose appropriate difficulty level</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• You can edit words later from the word list</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
    color: theme.semanticColors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  headerTitle: {
    ...theme.typography.text.h3,
    color: theme.semanticColors.textPrimary,
  },
  saveButton: {
    backgroundColor: theme.semanticColors.brand,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
  },
  saveButtonDisabled: {
    backgroundColor: theme.semanticColors.borderLight,
  },
  saveButtonText: {
    ...theme.typography.text.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold,
  },
  saveButtonTextDisabled: {
    color: theme.semanticColors.textSecondary,
  },
  content: {
    flex: 1,
    padding: theme.spacing[6],
  },
  inputSection: {
    marginBottom: theme.spacing[6],
  },
  inputLabel: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing[2],
  },
  inputDescription: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    marginBottom: theme.spacing[3],
  },
  textInput: {
    backgroundColor: theme.semanticColors.surface,
    borderWidth: 1,
    borderColor: theme.semanticColors.borderLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    ...theme.typography.text.body,
    color: theme.semanticColors.textPrimary,
  },
  definitionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.textSecondary,
    textAlign: 'right',
    marginTop: theme.spacing[1],
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  difficultyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[3],
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.semanticColors.surface,
  },
  difficultyButtonSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  difficultyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing[2],
  },
  difficultyText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  difficultyTextSelected: {
    color: theme.semanticColors.brand,
    fontWeight: theme.typography.fontWeight.bold,
  },
  tipsSection: {
    backgroundColor: theme.semanticColors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginTop: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.semanticColors.borderLight,
  },
  tipsTitle: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[3],
  },
  tipItem: {
    marginBottom: theme.spacing[2],
  },
  tipText: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    lineHeight: 18,
  },
});

export default AddWordScreen;
