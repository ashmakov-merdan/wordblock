import { CheckIcon } from "phosphor-react-native";
import { FC, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "shared/theme";
import { Sheet, useToggleSheet } from "shared/ui";

type FilterState = 'daily' | 'weekly' | 'monthly';

interface ChartFiltersProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

const ChartFilters: FC<ChartFiltersProps> = ({ filter, onFilterChange }) => {
  const { bottomSheetRef, onOpenSheet, onCloseSheet } = useToggleSheet();


  const handleChange = useCallback((state: FilterState) => {
    onFilterChange(state);
    onCloseSheet();
  }, [onFilterChange, onCloseSheet]);

  return (
    <>
      <TouchableOpacity onPress={onOpenSheet}>
        <Text style={[styles.trigger, styles.label]}>{filter}</Text>
      </TouchableOpacity>
      <Sheet ref={bottomSheetRef} onClose={onCloseSheet}>
        <View style={styles.content}>
          {(['daily', 'weekly', 'monthly'] as FilterState[]).map((state) => {
            const isActive = state === filter;

            return (
              <TouchableOpacity style={styles.item} activeOpacity={0.8} onPress={() => handleChange(state)} key={state}>
                <Text style={[styles.label, isActive ? styles.active : styles.inactive]}>{state}</Text>
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
  content: {
    width: '100%',
    flexDirection: 'column'
  },
  trigger: {
    width: theme.spacing[24],
    backgroundColor: theme.semanticColors.surface,
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.semanticColors.borderLight,
    textAlign: 'center'
  },
  item: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  }
})

ChartFilters.displayName = 'ChartFilters';

export default ChartFilters;