import { BottomSheetModal, BottomSheetModalProps, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, memo, ReactNode, useCallback } from "react";
import { SharedValue } from "react-native-reanimated";
import { colors } from "shared/theme/colors";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Backdrop from "./backdrop";

interface SheetProps extends Partial<BottomSheetModalProps> {
  children: ReactNode;
  display?: string;
  sizes?: (number | string)[] | SharedValue<(string | number)[]>;
  onClose?: () => void;
};

export const Sheet = memo(forwardRef<BottomSheetModal, SheetProps>(({ children, onClose, display, sizes, ...props }, ref) => {
  const { bottom } = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      return () => onClose?.();
    }, [onClose])
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={sizes}
      enablePanDownToClose
      backdropComponent={(props) => <Backdrop onPress={onClose} {...props} />}
      handleIndicatorStyle={{
        backgroundColor: colors.neutral[200]
      }}
      {...props}
    >
      <BottomSheetView
        style={[
          styles.sheet,
          {
            paddingBottom: Platform.OS === "ios" ? bottom : bottom + 24
          }
        ]}>
        {display && (
          <View style={styles.display}>
            <Text style={styles.title}>{display}</Text>
          </View>
        )}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  )
}));

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    alignItems: 'center',
  },
  display: {
    paddingHorizontal: 22,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333'
  }
});

Sheet.displayName = 'Sheet';

export default Sheet;
