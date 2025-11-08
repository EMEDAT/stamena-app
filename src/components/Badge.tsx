import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

export const Badge: React.FC = () => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const iconRotation = useSharedValue(0);

  useEffect(() => {
    // Badge entrance with spring
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
      mass: 1,
    });

    // Badge subtle rotation
    rotation.value = withRepeat(
      withTiming(-180, { duration: 300 }),
      1,
      false
    );

    // Icon continuous rotation
    iconRotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const badgeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${iconRotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.badge, badgeAnimatedStyle]}>
      <Animated.Text style={[styles.icon, iconAnimatedStyle]}>⚡</Animated.Text>
      <Text style={styles.text}>STUDY FACT</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandRed,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignSelf: 'center',
    gap: 6,
    shadowColor: COLORS.brandRed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  icon: {
    fontSize: 18,
    color: COLORS.white,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
});