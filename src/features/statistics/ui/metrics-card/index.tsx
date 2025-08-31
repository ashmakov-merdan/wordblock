import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "shared/theme";

interface MetricsCardProps {
  value: number | string;
  label: string;
  unit: string;
}

const MetricsCard: FC<MetricsCardProps> = ({ value, label, unit }) => {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  metricCard: {
    backgroundColor: theme.semanticColors.surface,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    width: '48%',
    marginBottom: theme.spacing[3],
    alignItems: 'center',
    ...theme.shadows.md,
  },
  metricValue: {
    ...theme.typography.text.h2,
    color: theme.semanticColors.brand,
    fontWeight: theme.typography.fontWeight.bold,
  },
  metricLabel: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },
  metricUnit: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },
});

MetricsCard.displayName = 'MetricsCard';

export default MetricsCard;