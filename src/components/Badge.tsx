import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { COLORS } from '../constants/colors';
import { ANIMATION_DELAYS, ANIMATION_DURATIONS } from '../constants/animations';

export const Badge: React.FC = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: ANIMATION_DURATIONS.badge });
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.badge, animatedStyle]}>
        <Text style={styles.icon}>✓</Text>
        <Text style={styles.text}>STUDY FACT</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.brandRed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: COLORS.brandRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 14,
    color: COLORS.white,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: -0.23,
  },
});