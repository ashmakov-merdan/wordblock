import { FC } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { theme } from "shared/theme";

interface SettingsItemProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const SettingsItem: FC<SettingsItemProps> = ({ label, description, value, onChange }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text numberOfLines={2} style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.colors.border.light, true: theme.colors.primary[500] }}
        thumbColor="white"
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...theme.typography.text.body,
    color: theme.semanticColors.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  description: {
    maxWidth: 280,
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    fontFamily: 'Inter-Regular',
  }
})

SettingsItem.displayName = 'SettingsItem';

export default SettingsItem;