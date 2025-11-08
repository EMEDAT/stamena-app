import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const Graph: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const greenLineAnim = useRef(new Animated.Value(0)).current;
  const redLineAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;
  const dotX = useRef(new Animated.Value(40)).current;
  const dotY = useRef(new Animated.Value(140)).current;

  useEffect(() => {
    // Fade in container
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 700,
      useNativeDriver: true,
    }).start();

    // Draw green line
    Animated.timing(greenLineAnim, {
      toValue: 1,
      duration: 2000,
      delay: 1100,
      useNativeDriver: true,
    }).start();

    // Draw red line
    Animated.timing(redLineAnim, {
      toValue: 1,
      duration: 2000,
      delay: 1300,
      useNativeDriver: true,
    }).start();

    // Show dot
    Animated.timing(dotAnim, {
      toValue: 1,
      duration: 400,
      delay: 2600,
      useNativeDriver: true,
    }).start(() => {
      // Animate dot movement
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(dotX, { toValue: 280, duration: 3000, useNativeDriver: true }),
            Animated.timing(dotY, { toValue: 35, duration: 3000, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(dotX, { toValue: 40, duration: 3000, useNativeDriver: true }),
            Animated.timing(dotY, { toValue: 140, duration: 3000, useNativeDriver: true }),
          ]),
        ])
      ).start();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Label */}
      <View style={styles.label}>
        <Text style={styles.labelIcon}>🕐</Text>
        <Text style={styles.labelText}>Sex duration</Text>
      </View>

      {/* Graph Area */}
      <View style={styles.graphArea}>
        {/* Grid Lines */}
        <View style={[styles.gridLine, { top: '20%' }]} />
        <View style={[styles.gridLine, { top: '40%' }]} />
        <View style={[styles.gridLine, { top: '60%' }]} />
        <View style={[styles.gridLine, { top: '80%' }]} />

        {/* SVG Graph */}
        <Svg width="100%" height="100%" viewBox="0 0 343 220">
          {/* Green line - With Kegels */}
          <AnimatedPath
            d="M 40 140 Q 120 100, 200 60 T 300 28"
            stroke={COLORS.brandGreen}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity={greenLineAnim}
          />
          
          {/* Red line - No Kegels */}
          <AnimatedPath
            d="M 40 145 Q 120 155, 200 165 T 300 180"
            stroke={COLORS.brandRed}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity={redLineAnim}
          />

          {/* Animated dot */}
          <AnimatedCircle
            cx={dotX}
            cy={dotY}
            r="8"
            fill={COLORS.white}
            opacity={dotAnim}
          />
        </Svg>

        {/* Now marker */}
        <View style={styles.nowMarker}>
          <View style={styles.nowLabel}>
            <Text style={styles.nowText}>Now</Text>
          </View>
          <View style={styles.nowArrow} />
        </View>

        {/* 7x multiplier */}
        <View style={styles.multiplier}>
          <Text style={styles.multiplierText}>↑</Text>
          <Text style={styles.multiplierValue}>7x</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.brandGreen }]} />
          <Text style={styles.legendText}>With Kegels</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.brandRed }]} />
          <Text style={styles.legendText}>No Kegels</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.gray[900],
    borderWidth: 1,
    borderColor: COLORS.gray[850],
    borderRadius: 12,
    padding: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginLeft: 35,
    marginBottom: 16,
  },
  labelIcon: {
    fontSize: 18,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  graphArea: {
    height: 220,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLORS.gray[700],
    marginBottom: 16,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.gray[800],
  },
  nowMarker: {
    position: 'absolute',
    bottom: -30,
    left: 17,
    alignItems: 'center',
  },
  nowLabel: {
    backgroundColor: COLORS.gray[700],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nowText: {
    fontSize: 16,
    color: COLORS.white,
  },
  nowArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.gray[700],
    marginTop: -1,
  },
  multiplier: {
    position: 'absolute',
    top: 70,
    right: 16,
    alignItems: 'center',
  },
  multiplierText: {
    fontSize: 40,
    color: COLORS.accentGreen,
  },
  multiplierValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  legend: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[900],
    borderWidth: 1,
    borderColor: COLORS.gray[850],
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    gap: 40,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});