import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 32;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const Graph: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const dotProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 700,
      useNativeDriver: true,
    }).start();

    // Show dot after lines draw
    Animated.timing(dotOpacity, {
      toValue: 1,
      duration: 400,
      delay: 2600,
      useNativeDriver: true,
    }).start(() => {
      // Animate dot along path
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotProgress, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(dotProgress, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  // Calculate dot position along bezier curve
  const dotX = dotProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [40, 180, 290],
  });

  const dotY = dotProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [160, 80, 35],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Sex Duration Label */}
      <View style={styles.label}>
        <Text style={styles.labelIcon}>🕐</Text>
        <Text style={styles.labelText}>Sex duration</Text>
      </View>

      {/* Graph Container */}
      <View style={styles.graphContainer}>
        {/* Grid Lines */}
        <View style={[styles.gridLine, { top: '20%' }]} />
        <View style={[styles.gridLine, { top: '40%' }]} />
        <View style={[styles.gridLine, { top: '60%' }]} />
        <View style={[styles.gridLine, { top: '80%' }]} />

        {/* Axes */}
        <View style={styles.yAxis} />
        <View style={styles.xAxis} />

        {/* SVG Graph */}
        <Svg width="100%" height="100%" style={styles.svg}>
          {/* Green line - smooth curve going UP */}
          <Path
            d="M 40 160 C 100 120, 160 70, 220 50 C 250 40, 270 32, 290 35"
            stroke={COLORS.brandGreen}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            opacity={0.95}
          />
          
          {/* Red line - smooth curve going DOWN */}
          <Path
            d="M 40 165 C 100 175, 160 180, 220 185 C 260 188, 280 190, 310 195"
            stroke={COLORS.brandRed}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            opacity={0.95}
          />

          {/* Animated white dot */}
          <AnimatedCircle
            cx={dotX}
            cy={dotY}
            r="8"
            fill={COLORS.white}
            opacity={dotOpacity}
          />
        </Svg>

        {/* Glow effect behind green line */}
        <View style={styles.glow} />

        {/* Now Marker */}
        <View style={styles.nowMarker}>
          <View style={styles.nowLabelContainer}>
            <Text style={styles.nowText}>Now</Text>
          </View>
          <View style={styles.nowArrow} />
        </View>

        {/* 7x Multiplier with Arrow */}
        <View style={styles.multiplierContainer}>
          <View style={styles.arrow}>
            <View style={styles.arrowLine} />
            <View style={styles.arrowHead} />
          </View>
          <Text style={styles.multiplierText}>7x</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.brandGreen }]} />
          <Text style={styles.legendText}>With Kegels</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.brandRed }]} />
          <Text style={styles.legendText}>No Kegels</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.gradientGray.from,
    borderWidth: 1,
    borderColor: COLORS.gray[900],
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginLeft: 35,
    marginBottom: 12,
  },
  labelIcon: {
    fontSize: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: -0.31,
  },
  graphContainer: {
    height: 240,
    position: 'relative',
    marginBottom: 8,
  },
  gridLine: {
    position: 'absolute',
    left: 17,
    right: 0,
    height: 1,
    backgroundColor: COLORS.gray[800],
    opacity: 0.3,
  },
  yAxis: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 20,
    width: 1,
    backgroundColor: COLORS.gray[700],
  },
  xAxis: {
    position: 'absolute',
    left: 16,
    right: 0,
    bottom: 20,
    height: 1,
    backgroundColor: COLORS.gray[700],
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  glow: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    height: 120,
    backgroundColor: COLORS.brandGreen,
    opacity: 0.08,
    borderRadius: 100,
    transform: [{ scaleX: 2 }],
  },
  nowMarker: {
    position: 'absolute',
    bottom: -10,
    left: 33,
    alignItems: 'center',
    zIndex: 10,
  },
  nowLabelContainer: {
    backgroundColor: COLORS.gray[700],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 2,
  },
  nowText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '400',
    letterSpacing: -0.31,
  },
  nowArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.gray[700],
  },
  multiplierContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    alignItems: 'center',
    gap: 4,
  },
  arrow: {
    alignItems: 'center',
  },
  arrowLine: {
    width: 3,
    height: 90,
    backgroundColor: COLORS.accentGreen,
    borderRadius: 2,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.accentGreen,
    marginTop: -2,
  },
  multiplierText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: -0.43,
  },
  legend: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[900],
    borderWidth: 1,
    borderColor: COLORS.gray[850],
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    gap: 40,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: -0.23,
  },
});