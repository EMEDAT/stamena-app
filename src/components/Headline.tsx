import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

export const Headline: React.FC = () => {
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const translateY1 = useSharedValue(20);
  const translateY2 = useSharedValue(20);

  useEffect(() => {
    // First part of text
    opacity1.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    translateY1.value = withDelay(
      400,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    // Second part (highlight)
    opacity2.value = withDelay(
      800,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    translateY2.value = withDelay(
      800,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const firstPartStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity1.value,
      transform: [{ translateY: translateY1.value }],
    };
  });

  const highlightStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity2.value,
      transform: [{ translateY: translateY2.value }],
    };
  });

  return (
    <Animated.Text style={styles.headline}>
      <Animated.Text style={firstPartStyle}>
        Kegel exercises strengthen PF muscles, which significantly increases{' '}
      </Animated.Text>
      <Animated.Text style={[styles.highlight, highlightStyle]}>
        ejaculation control.
      </Animated.Text>
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  headline: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -0.31,
    marginBottom: 24,
  },
  highlight: {
    color: COLORS.accentGreen,
  },
});