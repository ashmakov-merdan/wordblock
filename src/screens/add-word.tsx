import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from 'shared/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { difficulties, useCreateWord } from 'entities/words';

const AddWordScreen = () => {
  const { values, loading, isFormValid, handleAdd, handleCancel, onChange } = useCreateWord();

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
            onPress={handleAdd}
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
              value={values.word}
              onChangeText={(value) => onChange('word', value)}
              placeholder="Enter the word you want to learn"
              placeholderTextColor={theme.semanticColors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={50}
            />
            <Text style={styles.characterCount}>
              {values.word.length}/50 characters
            </Text>
          </View>

          {/* Definition Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Definition *</Text>
            <TextInput
              style={[styles.textInput, styles.definitionInput]}
              value={values.definition}
              onChangeText={(value) => onChange('definition', value)}
              placeholder="Enter the definition or meaning of the word"
              placeholderTextColor={theme.semanticColors.textSecondary}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {values.definition.length}/500 characters
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
                    values.difficulty === diff.value && styles.difficultyButtonSelected,
                    { borderColor: diff.color }
                  ]}
                  onPress={() => onChange("difficulty", diff.value)}
                >
                  <Text style={[
                    styles.difficultyText,
                    values.difficulty === diff.value && styles.difficultyTextSelected
                  ]}>
                    {diff.label}
                  </Text>
                </TouchableOpacity>
              ))}
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
  tipsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  tipsTitle: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
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
