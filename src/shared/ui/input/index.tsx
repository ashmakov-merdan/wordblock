import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Icon } from "phosphor-react-native";
import { FC } from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from "react-native";
import { theme } from "shared/theme";

interface InputProps {
  startIcon?: Icon;
  endIcon?: Icon;
  placeholder?: string;
  value?: string;
  onChange: (text: string) => void;
  type: 'default' | 'bottomSheet';
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
}

const Input: FC<InputProps> = ({ startIcon, endIcon, placeholder, value, onChange, type = 'default', multiline=false, numberOfLines, keyboardType='default' }) => {
  const StartIcon = startIcon;
  const EndIcon = endIcon;

  return (
    <View style={styles.container}>
      {StartIcon && <StartIcon size={24} color={theme.colors.neutral[500]} />}
      {type === 'default' ? (
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.neutral[400]}
          value={value}
          onChangeText={onChange}
          autoComplete={'off'}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          returnKeyType="next"
        />
      ) : (
        <BottomSheetTextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.neutral[400]}
          value={value}
          onChangeText={onChange}
          autoComplete={'off'}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          returnKeyType='done'
        />
      )}
      {EndIcon && <EndIcon size={24} color={theme.colors.neutral[500]} />}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.base,
  },
  input: {
    flex: 1,

  }
})

Input.displayName = 'Input';

export default Input;