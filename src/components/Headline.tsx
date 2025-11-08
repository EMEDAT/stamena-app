import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { COLORS } from '../constants/colors';
import { ANIMATION_DELAYS, ANIMATION_DURATIONS } from '../constants/animations';

export const Headline: React.FC = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(
      ANIMATION_DELAYS.headline,
      withTiming(1, { duration: ANIMATION_DURATIONS.headline })
    );
    translateY.value = withDelay(
      ANIMATION_DELAYS.headline,
      withTiming(0, { duration: ANIMATION_DURATIONS.headline })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text style={[styles.headline, animatedStyle]}>
      Kegel exercises strengthen PF muscles, which significantly increases{' '}
      <Text style={styles.highlight}>ejaculation control.</Text>
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