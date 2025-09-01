import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "shared/theme";
import React, { useEffect, useCallback } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import textToSpeech from "shared/utils/text-to-speech";

interface WordBlockProps {
  word: string;
  delay?: number;
  position?: { x: number; y: number };
  animationVariant?: number; // Different animation patterns
}

const WordBlock = ({ word, delay = 0, position = { x: 0, y: 0 }, animationVariant = 0 }: WordBlockProps) => {
  const scale = useSharedValue(0); // Start with 0 scale for entrance animation
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0); // Start with 0 opacity for fade-in

  const startAnimations = useCallback(() => {
    // Start entrance animation after the specified delay
    const entranceTimer = setTimeout(() => {
      scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.2)) });
      opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
      
      // Start rotation animation after entrance completes
      const rotationTimer = setTimeout(() => {
        // Different rotation patterns based on variant
        const rotationAngle = animationVariant % 3 === 0 ? 8 : animationVariant % 3 === 1 ? 5 : 12;
        const rotationDuration = animationVariant % 2 === 0 ? 4000 : 6000;
        
        rotation.value = withRepeat(
          withSequence(
            withTiming(rotationAngle, { duration: rotationDuration, easing: Easing.inOut(Easing.sin) }),
            withTiming(-rotationAngle, { duration: rotationDuration, easing: Easing.inOut(Easing.sin) })
          ),
          -1,
          true
        );
      }, 800); // Wait for entrance animation to complete

      return rotationTimer;
    }, delay);

    return entranceTimer;
  }, [delay, scale, opacity, rotation, animationVariant]);

  useEffect(() => {
    const timer = startAnimations();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [startAnimations]);

  const handlePress = useCallback(async () => {
    scale.value = withSequence(
      withTiming(0.99, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    await textToSpeech.speak(word);
  }, [word, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: 0.6,
    };
  }, []);

  const getBackgroundColor = () => {
    const colors = [
      theme.colors.primary[50],
      theme.colors.purple[50],
      theme.colors.success[50],
      theme.colors.error[50],
      theme.colors.warning[50],
      theme.colors.neutral[50],
    ];
    return colors[animationVariant % colors.length];
  };

  return (
    <Animated.View style={[styles.container, { left: position.x, top: position.y }, animatedStyle]}>
      <TouchableOpacity
        style={[styles.touchable, { backgroundColor: getBackgroundColor() }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>{word}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  touchable: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary[100],
    shadowColor: theme.colors.primary[200],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 60,
    minHeight: 40,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: theme.colors.text.primary,
    textAlign: 'center',
  }
});

WordBlock.displayName = 'WordBlock';

export default WordBlock;