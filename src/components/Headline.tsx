import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/colors';

export const Headline: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.Text style={[styles.headline, { opacity: fadeAnim, transform: [{ translateY }] }]}>
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