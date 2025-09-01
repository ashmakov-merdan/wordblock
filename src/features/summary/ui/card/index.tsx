import { Icon } from "phosphor-react-native";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "shared/theme/colors";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: Icon;
  color: string;
};

const SummaryCard: FC<SummaryCardProps> = ({ title, value, icon, color }) => {
  const CardIcon = icon;

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container}>
      <CardIcon size={42} color={color} weight='fill' />
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color: color }]}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 22,
    paddingHorizontal: 24,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral[700],
  },
  value: {
    fontSize: 36,
    fontWeight: '600',
  }
})

SummaryCard.displayName = 'SummaryCard';

export default SummaryCard;