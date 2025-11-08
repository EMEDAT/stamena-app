import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

export const Source: React.FC = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const iconScale = useSharedValue(0.8);

  useEffect(() => {
    // Container fade and slide
    opacity.value = withDelay(
      1700,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      1700,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    // Icon pop
    iconScale.value = withDelay(
      1900,
      withSpring(1, {
        damping: 12,
        stiffness: 300,
      })
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.diamond, iconStyle]}>
        <Text style={styles.diamondIcon}>◊</Text>
      </Animated.View>
      <View>
        <Text style={styles.label}>Source:</Text>
        <Text style={styles.name}>Sapienza University</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.gray[900],
    borderWidth: 1,
    borderColor: COLORS.gray[850],
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  diamond: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.gray[950],
    borderWidth: 1,
    borderColor: COLORS.gray[800],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondIcon: {
    fontSize: 16,
    color: COLORS.white,
  },
  label: {
    fontSize: 13,
    color: COLORS.gray[500],
    lineHeight: 18,
  },
  name: {
    fontSize: 13,
    color: COLORS.white,
    lineHeight: 18,
  },
});