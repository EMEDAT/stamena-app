import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
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
  const opacity3 = useSharedValue(0);
  const translateY1 = useSharedValue(20);
  const translateY2 = useSharedValue(20);
  const translateY3 = useSharedValue(20);

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

    // Third part (highlight)
    opacity3.value = withDelay(
      1100,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    translateY3.value = withDelay(
      1100,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const line1Style = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ translateY: translateY1.value }],
  }));
  const line2Style = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ translateY: translateY2.value }],
  }));
  const line3Style = useAnimatedStyle(() => ({
    opacity: opacity3.value,
    transform: [{ translateY: translateY3.value }],
  }));

  return (
    <View style={styles.headlineGroup}>
      <Animated.Text style={[styles.headline, line1Style]}>
        Kegel exercises strengthen PF muscles,
      </Animated.Text>
      <Animated.Text style={[styles.headline, line2Style]}>
        which significantly increases
      </Animated.Text>
      <Animated.Text style={[styles.headline, styles.highlight, line3Style]}>
        ejaculation control.
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headlineGroup: {
    marginBottom: 50,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -0.31,
  },
  highlight: {
    color: COLORS.accentGreen,
  },
});