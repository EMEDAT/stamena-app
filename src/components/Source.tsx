import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/colors';

export const Source: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 1700,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: 1700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.diamond}>
        <Text style={styles.diamondIcon}>◊</Text>
      </View>
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
