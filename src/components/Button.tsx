import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Button entrance animation
    opacity.value = withDelay(2100, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(
      2100,
      withSpring(0, {
        damping: 20,
        stiffness: 200,
      })
    );
  }, []);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(glowOpacity.value, [0, 1], [0.3, 0.6]),
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 100 });
    glowOpacity.value = withTiming(1, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    glowOpacity.value = withTiming(0, { duration: 200 });
  };

  return (
    <AnimatedPressable
      style={[styles.button, buttonAnimatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => {
        console.log('Button pressed!');
      }}
    >
      <Animated.View style={[styles.glow, glowAnimatedStyle]} />
      <Text style={styles.text}>I got it</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.brandRed,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: COLORS.brandRed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'visible',
  },
  glow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: COLORS.brandRed,
    borderRadius: 20,
    opacity: 0,
    zIndex: -1,
  },
  text: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
});