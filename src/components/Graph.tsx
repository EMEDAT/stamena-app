import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop, Rect, G, Ellipse } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

const { width: screenWidth } = Dimensions.get('window');
const GRAPH_WIDTH = screenWidth - 32;
const GRAPH_HEIGHT = 240;

export const Graph: React.FC = () => {
  // Animation values
  const containerFade = useRef(new Animated.Value(0)).current;
  const labelSlide = useRef(new Animated.Value(-20)).current;
  const greenPathAnim = useRef(new Animated.Value(0)).current;
  const redPathAnim = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;
  const glowRadius = useRef(new Animated.Value(15)).current;
  const nowMarkerOpacity = useRef(new Animated.Value(0)).current;
  const arrowTranslate = useRef(new Animated.Value(50)).current;
  const multiplierOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orchestrated animation sequence
    Animated.sequence([
      // 1. Fade in container
      Animated.timing(containerFade, {
        toValue: 1,
        duration: 600,
        delay: 500,
        useNativeDriver: true,
      }),
      
      // 2. Label slides down
      Animated.parallel([
        Animated.spring(labelSlide, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        
        // 3. Now marker appears
        Animated.timing(nowMarkerOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      
      // 4. Lines draw simultaneously
      Animated.parallel([
        Animated.timing(greenPathAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(redPathAnim, {
          toValue: 1,
          duration: 1800,
          delay: 200,
          useNativeDriver: false,
        }),
      ]),
      
      // 5. Dot appears with bounce
      Animated.spring(dotScale, {
        toValue: 1,
        tension: 40,
        friction: 3,
        useNativeDriver: false,
      }),
      
      // 6. Arrow and multiplier slide up
      Animated.parallel([
        Animated.spring(arrowTranslate, {
          toValue: 0,
          tension: 35,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(multiplierOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous animations
    // Dot pulsing
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(dotPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowRadius, {
          toValue: 25,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(glowRadius, {
          toValue: 15,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // Calculate the actual SVG paths based on viewport
  const startX = 45;
  const startY = GRAPH_HEIGHT - 50;
  const endX = GRAPH_WIDTH - 40;
  
  // Green line path (With Kegels - curves up dramatically)
  const greenPath = `M ${startX} ${startY} Q ${startX + 60} ${startY - 20}, ${startX + 120} ${startY - 60} T ${startX + 200} ${startY - 120} Q ${endX - 30} ${startY - 145}, ${endX} ${startY - 155}`;
  
  // Red line path (No Kegels - stays relatively flat with slight decline)
  const redPath = `M ${startX} ${startY} Q ${startX + 80} ${startY + 5}, ${startX + 160} ${startY + 10} T ${endX - 40} ${startY + 15} L ${endX} ${startY + 18}`;

  return (
    <Animated.View style={[styles.container, { opacity: containerFade }]}>
      {/* Sex duration label */}
      <Animated.View 
        style={[
          styles.label,
          {
            transform: [{ translateY: labelSlide }],
          },
        ]}
      >
        <Text style={styles.labelIcon}>⏱</Text>
        <Text style={styles.labelText}>Sex duration</Text>
      </Animated.View>

      {/* Main Graph Container */}
      <View style={styles.graphContainer}>
        <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} style={StyleSheet.absoluteFillObject}>
          <Defs>
            {/* Dark green gradient background */}
            <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#0F3E26" stopOpacity="1" />
              <Stop offset="50%" stopColor="#0A2919" stopOpacity="1" />
              <Stop offset="100%" stopColor="#051611" stopOpacity="1" />
            </LinearGradient>
            
            {/* Dot glow gradient */}
            <LinearGradient id="dotGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4ADE80" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#22C55E" stopOpacity="0.1" />
            </LinearGradient>
          </Defs>

          {/* Background with gradient */}
          <Rect 
            x="0" 
            y="0" 
            width={GRAPH_WIDTH} 
            height={GRAPH_HEIGHT} 
            fill="url(#bgGradient)"
            rx="12"
          />

          {/* Horizontal grid lines (subtle) */}
          <G opacity="0.08">
            {[0.2, 0.4, 0.6, 0.8].map((factor, index) => (
              <Line
                key={index}
                x1={startX}
                y1={GRAPH_HEIGHT * factor}
                x2={endX}
                y2={GRAPH_HEIGHT * factor}
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            ))}
          </G>

          {/* Y-axis */}
          <Line
            x1={startX}
            y1="30"
            x2={startX}
            y2={startY + 5}
            stroke="#FFFFFF"
            strokeWidth="2"
            opacity="0.2"
          />

          {/* X-axis baseline (dashed) */}
          <Line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={startY}
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeDasharray="10 5"
            opacity="0.4"
          />

          {/* Red line - No Kegels */}
          <AnimatedPath
            d={redPath}
            stroke={COLORS.brandRed}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="400"
            strokeDashoffset={redPathAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [400, 0],
            })}
            opacity="0.9"
          />
          
          {/* Green line - With Kegels */}
          <AnimatedPath
            d={greenPath}
            stroke={COLORS.brandGreen}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="400"
            strokeDashoffset={greenPathAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [400, 0],
            })}
          />

          {/* Dot with glow at end of green line */}
<G>
  <AnimatedCircle
    cx={endX}
    cy={startY - 155}
    r={glowRadius}  // animate the radius directly
    fill="url(#dotGlow)"
    opacity={dotScale}
  />
  
  <AnimatedCircle
    cx={endX}
    cy={startY - 155}
    r="12"
    fill="#4ADE80"
    opacity={dotScale.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.3]
    })}
  />
  
  <AnimatedCircle
    cx={endX}
    cy={startY - 155}
    r={dotPulse.interpolate({
      inputRange: [1, 1.15],
      outputRange: [7, 8]
    })}
    fill="#FFFFFF"
    opacity={dotScale}
  />
</G>
        </Svg>

        {/* Now marker */}
        <Animated.View 
          style={[
            styles.nowMarker,
            { opacity: nowMarkerOpacity }
          ]}
        >
          <View style={styles.nowBubble}>
            <Text style={styles.nowText}>Now</Text>
          </View>
          <View style={styles.nowArrow} />
        </Animated.View>

        {/* 7x Multiplier with arrow */}
        <Animated.View 
          style={[
            styles.multiplierContainer,
            {
              opacity: multiplierOpacity,
              transform: [{ translateY: arrowTranslate }],
            },
          ]}
        >
          <View style={styles.arrowUp}>
            <View style={styles.arrowStem} />
            <View style={styles.arrowTip} />
          </View>
          <Text style={styles.multiplierText}>7x</Text>
        </Animated.View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, { backgroundColor: COLORS.brandGreen }]} />
          <Text style={styles.legendText}>With Kegels</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, { backgroundColor: COLORS.brandRed }]} />
          <Text style={styles.legendText}>No Kegels</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    marginLeft: 45,
    marginBottom: 20,
  },
  labelIcon: {
    fontSize: 20,
  },
  labelText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  graphContainer: {
    height: GRAPH_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nowMarker: {
    position: 'absolute',
    bottom: 35,
    left: 20,
    alignItems: 'center',
  },
  nowBubble: {
    backgroundColor: 'rgba(71, 85, 105, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  nowText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  nowArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(71, 85, 105, 0.95)',
    marginTop: -1,
  },
  multiplierContainer: {
    position: 'absolute',
    top: 25,
    right: 35,
    alignItems: 'center',
  },
  arrowUp: {
    alignItems: 'center',
    marginBottom: 8,
  },
  arrowStem: {
    width: 3,
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  arrowTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: -10,
  },
  multiplierText: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 36,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendIndicator: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
});