import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { COLORS } from '../constants/colors';

// Use project-root assets folder
const wavyCheck = require('../../assets/wavyCheck.png');

export const Badge: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const iconSize = 18;
  const revealWidth = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(revealWidth, { toValue: iconSize, duration: 480, useNativeDriver: false }),
        Animated.spring(iconScale, { toValue: 1, damping: 12, stiffness: 220, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.badge, { opacity: fadeAnim, transform: [{ translateY }] }]}>
        {/* Animated reveal of your wavyCheck asset */}
        <Animated.View style={{ width: revealWidth, height: iconSize, overflow: 'hidden' }}>
          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            <Image source={wavyCheck} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
          </Animated.View>
        </Animated.View>

        <Text style={styles.text}>Label</Text>
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
    gap: 8,
    backgroundColor: COLORS.brandRed,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: COLORS.brandRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.white,
    letterSpacing: 0.4,
  },
});