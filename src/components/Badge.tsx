import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/colors';

export const Badge: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.badge, { opacity: fadeAnim, transform: [{ translateY }] }]}>
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
  },
  icon: {
    fontSize: 14,
    color: COLORS.white,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});