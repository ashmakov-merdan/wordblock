import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { Fragment, useMemo } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Backdrop = ({ animatedIndex, style, onPress }: BottomSheetBackdropProps & { onPress?: () => void }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolate.CLAMP),
  }));

  const containerStyle = useMemo(() => [
    style,
    {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      overflow: 'hidden'
    } as ViewStyle,
    StyleSheet.absoluteFill,
    containerAnimatedStyle,
  ], [style, containerAnimatedStyle]);

  return (
    <Fragment>
      <AnimatedPressable style={containerStyle} onPress={onPress} />
    </Fragment>
  )
};

export default Backdrop;