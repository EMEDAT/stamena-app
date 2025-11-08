import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G, Line, Rect } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRAPH_WIDTH = SCREEN_WIDTH - 70;
const GRAPH_HEIGHT = 240;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export const Graph: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const greenLineProgress = useRef(new Animated.Value(0)).current;
  const redLineProgress = useRef(new Animated.Value(0)).current;
  const dotProgress = useRef(new Animated.Value(0)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in container
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 700,
      useNativeDriver: true,
    }).start();

    // Draw lines
    Animated.parallel([
      Animated.timing(greenLineProgress, {
        toValue: 1,
        duration: 2000,
        delay: 1100,
        useNativeDriver: true,
      }),
      Animated.timing(redLineProgress, {
        toValue: 1,
        duration: 2000,
        delay: 1300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate dot along curve
    Animated.timing(dotProgress, {
      toValue: 1,
      duration: 2500,
      delay: 1100,
      useNativeDriver: true,
    }).start();

    // Pulse animation for dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(dotPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Calculate dot position along bezier curve
  const dotX = dotProgress.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: [40, GRAPH_WIDTH * 0.35, GRAPH_WIDTH * 0.7, GRAPH_WIDTH - 20],
  });

  const dotY = dotProgress.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: [GRAPH_HEIGHT - 40, GRAPH_HEIGHT - 95, GRAPH_HEIGHT - 155, GRAPH_HEIGHT - 200],
  });

  const dotScale = dotPulse.interpolate({
    inputRange: [1, 1.3],
    outputRange: [1, 1.3],
  });

  // Green line path (curved upward) - matches Figma exactly
  const greenPath = `M 40 ${GRAPH_HEIGHT - 40} Q ${GRAPH_WIDTH * 0.35} ${GRAPH_HEIGHT - 95}, ${GRAPH_WIDTH * 0.7} ${GRAPH_HEIGHT - 155} T ${GRAPH_WIDTH - 20} ${GRAPH_HEIGHT - 200}`;
  
  // Red line path (curved downward)
  const redPath = `M 40 ${GRAPH_HEIGHT - 40} Q ${GRAPH_WIDTH * 0.4} ${GRAPH_HEIGHT - 25}, ${GRAPH_WIDTH * 0.7} ${GRAPH_HEIGHT - 15} T ${GRAPH_WIDTH} ${GRAPH_HEIGHT - 5}`;

  const greenStrokeDashoffset = greenLineProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [GRAPH_WIDTH * 2, 0],
  });

  const redStrokeDashoffset = redLineProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [GRAPH_WIDTH * 2, 0],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Label */}
      <View style={styles.label}>
        <View style={styles.iconCircle}>
          <Text style={styles.labelIcon}>⏱</Text>
        </View>
        <Text style={styles.labelText}>Sex duration</Text>
      </View>

      {/* Graph Area */}
      <View style={styles.graphArea}>
        <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}>
          <Defs>
            {/* Background gradient - dark green to light green */}
            <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#0d3b2e" stopOpacity="0.9" />
              <Stop offset="50%" stopColor="#1a5c44" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#4ade80" stopOpacity="0.25" />
            </LinearGradient>

            {/* Arrow gradient - white to gray */}
            <LinearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <Stop offset="70%" stopColor="#d1d5db" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#9ca3af" stopOpacity="0.7" />
            </LinearGradient>

            {/* Baseline gradient - green to red */}
            <LinearGradient id="baselineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
              <Stop offset="30%" stopColor="#fbbf24" stopOpacity="1" />
              <Stop offset="60%" stopColor="#fb923c" stopOpacity="1" />
              <Stop offset="85%" stopColor="#ef4444" stopOpacity="1" />
              <Stop offset="100%" stopColor="#991b1b" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Background gradient rectangle */}
          <Rect
            x="0"
            y="0"
            width={GRAPH_WIDTH}
            height={GRAPH_HEIGHT}
            fill="url(#bgGradient)"
          />

          {/* Baseline - gradient dashed line */}
          <Line
            x1={40}
            y1={GRAPH_HEIGHT - 40}
            x2={GRAPH_WIDTH}
            y2={GRAPH_HEIGHT - 40}
            stroke="url(#baselineGradient)"
            strokeWidth="7"
            strokeDasharray="18 12"
            strokeLinecap="round"
          />

          {/* "Now" dot on baseline */}
          <Circle
            cx={40}
            cy={GRAPH_HEIGHT - 40}
            r={11}
            fill="#ffffff"
            stroke="#6b7280"
            strokeWidth="3"
          />

          {/* Red line (No Kegels) - thick animated */}
          <AnimatedPath
            d={redPath}
            stroke="#ef4444"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={GRAPH_WIDTH * 2}
            strokeDashoffset={redStrokeDashoffset}
          />

          {/* Green line (With Kegels) - thick animated */}
          <AnimatedPath
            d={greenPath}
            stroke="#4ade80"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={GRAPH_WIDTH * 2}
            strokeDashoffset={greenStrokeDashoffset}
          />

          {/* Animated dot moving along green line */}
          <AnimatedCircle
            cx={dotX}
            cy={dotY}
            r={11}
            fill="#ffffff"
            stroke="#4ade80"
            strokeWidth="4"
            scale={dotScale}
          />

          {/* Gradient UP ARROW on right side - EXACT match */}
          <G transform={`translate(${GRAPH_WIDTH - 50}, ${GRAPH_HEIGHT - 185})`}>
            {/* Arrow shaft - thick gradient */}
            <Rect
              x="13"
              y="10"
              width="20"
              height="85"
              fill="url(#arrowGradient)"
              rx="10"
            />
            {/* Arrow head - gradient triangle */}
            <Path
              d="M 23 0 L 0 28 L 46 28 Z"
              fill="url(#arrowGradient)"
            />
          </G>

          {/* Y-axis with arrow on left */}
          <G>
            <Line
              x1={40}
              y1={GRAPH_HEIGHT - 40}
              x2={40}
              y2={25}
              stroke="#ffffff"
              strokeWidth="3.5"
            />
            <Path
              d="M 40 18 L 32 35 L 48 35 Z"
              fill="#ffffff"
            />
          </G>
        </Svg>

        {/* Now label */}
        <View style={styles.nowMarker}>
          <View style={styles.nowLabel}>
            <Text style={styles.nowText}>Now</Text>
          </View>
        </View>

        {/* 7x multiplier */}
        <View style={styles.multiplier}>
          <Text style={styles.multiplierValue}>7x</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4ade80' }]} />
          <Text style={styles.legendText}>With Kegels</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
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
    gap: 10,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2d2d2d',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: 16,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelIcon: {
    fontSize: 16,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  graphArea: {
    position: 'relative',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  nowMarker: {
    position: 'absolute',
    bottom: 62,
    left: 45,
  },
  nowLabel: {
    backgroundColor: '#4b5563',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  nowText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  multiplier: {
    position: 'absolute',
    top: 80,
    right: 56,
  },
  multiplierValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.white,
  },
  legend: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#1f1f1f',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    marginHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});