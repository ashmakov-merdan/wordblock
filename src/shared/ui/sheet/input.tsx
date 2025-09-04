import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetTextInputProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput";
import { Icon } from "phosphor-react-native";
import { FC } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { theme } from "shared/theme";

interface ModalInputProps extends BottomSheetTextInputProps {
  startIcon?: Icon;
  endIcon?: Icon;
  placeholder?: string;
}

const Input: FC<ModalInputProps> = ({
  startIcon,
  endIcon,
  placeholder,
  multiline = false,
  numberOfLines,
  keyboardType = 'default',
  defaultValue,
  onChangeText,
}) => {
  const StartIcon = startIcon;
  const EndIcon = endIcon;

  return (
    <View style={styles.container}>
      {StartIcon && <StartIcon size={24} color={theme.colors.neutral[500]} />}
      <BottomSheetTextInput
        style={[styles.input]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.neutral[400]}
        defaultValue={defaultValue}
        onSubmitEditing={() => Keyboard.dismiss()}
        onChangeText={onChangeText}
        autoComplete={'off'}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        returnKeyType="next"
      />
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