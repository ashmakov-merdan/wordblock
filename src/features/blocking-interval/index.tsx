import { BLOCKING_INTERVAL, BLOCKING_INTERVALS } from "entities/settings";
import { CaretDownIcon, CheckIcon } from "phosphor-react-native";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "shared/theme";
import { Sheet, useToggleSheet } from "shared/ui";

interface BlockingIntervalProps {
  defaultValue: BLOCKING_INTERVAL;
  onChangeBlockingInterval: (interval: BLOCKING_INTERVAL) => void;
}

const BlockingInterval: FC<BlockingIntervalProps> = ({ defaultValue, onChangeBlockingInterval }) => {
  const { bottomSheetRef, onOpenSheet, onCloseSheet } = useToggleSheet();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Blocking Interval</Text>
          <Text style={styles.description}>How long to use device before blocking</Text>
        </View>
        <TouchableOpacity onPress={onOpenSheet} activeOpacity={0.8} style={styles.trigger}>
          <Text>30 minutes</Text>
          <CaretDownIcon size={24} color={theme.colors.neutral[500]} />
        </TouchableOpacity>
      </View>
      <Sheet ref={bottomSheetRef} onClose={onCloseSheet} display="Blocking Interval">
        <View style={styles.options}>
          {BLOCKING_INTERVALS.map((interval) => {
            const isActive = interval.value === defaultValue;

            return (
              <TouchableOpacity key={interval.value} onPress={() => onChangeBlockingInterval(interval.value)} style={styles.option}>
                <Text style={[styles.label, isActive ? styles.active : styles.inactive]}>{interval.label}</Text>
                {isActive && <CheckIcon size={24} color={theme.semanticColors.brand} />}
              </TouchableOpacity>
            )
          })}
        </View>
      </Sheet>
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    maxWidth: 200,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.semanticColors.textPrimary,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.semanticColors.textSecondary,
  },
  trigger: {
    width: theme.spacing[32],
    backgroundColor: theme.semanticColors.surface,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.semanticColors.borderLight,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  label: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    textTransform: "capitalize"
  },
  inactive: {
    color: theme.semanticColors.textPrimary
  },
  active: {
    color: theme.semanticColors.brand
  },
  options: {
    width: '100%',
    flexDirection: 'column',
    paddingTop: 20,
    gap: theme.spacing[2],
  },
  option: {
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[3],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

BlockingInterval.displayName = 'BlockingInterval';

export default BlockingInterval;