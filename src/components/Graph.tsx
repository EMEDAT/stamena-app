import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 32;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedView = Animated.View;

export const Graph: React.FC = () => {
  // Animation values
  const containerOpacity = useSharedValue(0);
  const labelSlide = useSharedValue(-30);
  const greenLineProgress = useSharedValue(0);
  const redLineProgress = useSharedValue(0);
  const dotOpacity = useSharedValue(0);
  const dotScale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const nowMarkerY = useSharedValue(20);
  const arrowY = useSharedValue(0);
  const multiplierScale = useSharedValue(0.8);

  useEffect(() => {
    // 1. Container fade in
    containerOpacity.value = withDelay(700, withTiming(1, { duration: 800 }));

    // 2. Label slide in
    labelSlide.value = withDelay(600, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));

    // 3. Draw green line
    greenLineProgress.value = withDelay(
      1100,
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.cubic) })
    );

    // 4. Draw red line
    redLineProgress.value = withDelay(
      1300,
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.cubic) })
    );

    // 5. Glow effect
    glowOpacity.value = withDelay(1600, withTiming(0.3, { duration: 800 }));
    glowScale.value = withDelay(
      1600,
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );

    // 6. Dot appears with bounce
    dotOpacity.value = withDelay(2600, withTiming(1, { duration: 400 }));
    dotScale.value = withDelay(
      2600,
      withSequence(
        withTiming(1.4, { duration: 300, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 200, easing: Easing.inOut(Easing.cubic) })
      )
    );

    // 7. Now marker slides up
    nowMarkerY.value = withDelay(
      1900,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    // 8. Arrow floats
    arrowY.value = withDelay(
      3100,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );

    // 9. Multiplier pops in
    multiplierScale.value = withDelay(
      3100,
      withSequence(
        withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 200 })
      )
    );
  }, []);

  // Animated props for green path
  const greenAnimatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: interpolate(greenLineProgress.value, [0, 1], [350, 0]),
    };
  });

  // Animated props for red path
  const redAnimatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: interpolate(redLineProgress.value, [0, 1], [350, 0]),
    };
  });

  // Animated style for container
  const containerStyle = useAnimatedProps(() => ({
    opacity: containerOpacity.value,
  }));

  // Animated style for label
  const labelStyle = useAnimatedProps(() => ({
    opacity: interpolate(labelSlide.value, [-30, 0], [0, 1]),
    transform: [{ translateX: labelSlide.value }],
  }));

  // Animated style for glow
  const glowStyle = useAnimatedProps(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  // Animated style for now marker
  const nowMarkerStyle = useAnimatedProps(() => ({
    opacity: interpolate(nowMarkerY.value, [20, 0], [0, 1]),
    transform: [{ translateY: nowMarkerY.value }],
  }));

  // Animated style for arrow
  const arrowStyle = useAnimatedProps(() => ({
    transform: [{ translateY: arrowY.value }],
  }));

  // Animated style for multiplier
  const multiplierContainerStyle = useAnimatedProps(() => ({
    opacity: interpolate(multiplierScale.value, [0.8, 1], [0, 1]),
    transform: [{ scale: multiplierScale.value }],
  }));

  // Animated props for dots
  const dotGlowProps = useAnimatedProps(() => ({
    opacity: dotOpacity.value,
  }));

  const dotCenterProps = useAnimatedProps(() => ({
    opacity: dotOpacity.value,
    r: interpolate(dotScale.value, [0, 1], [0, 7]),
  }));

  return (
    <AnimatedView style={[styles.container, containerStyle]}>
      {/* Sex Duration Label */}
      <AnimatedView style={[styles.label, labelStyle]}>
        <Text style={styles.labelIcon}>🕐</Text>
        <Text style={styles.labelText}>Sex duration</Text>
      </AnimatedView>

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

        {/* Glow effect behind green line - ANIMATED */}
        <AnimatedView style={[styles.glow, glowStyle]} />

        {/* SVG Graph */}
        <Svg width="100%" height="100%" style={styles.svg}>
          <Defs>
            {/* Green gradient */}
            <LinearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
              <Stop offset="100%" stopColor="#4ade80" stopOpacity="1" />
            </LinearGradient>

            {/* Red gradient */}
            <LinearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
              <Stop offset="100%" stopColor="#dc2626" stopOpacity="1" />
            </LinearGradient>

            {/* Radial gradient for dot glow */}
            <RadialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <Stop offset="70%" stopColor="#4ade80" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Green line - animated stroke */}
          <AnimatedPath
            d="M 40 160 C 100 120, 160 70, 220 50 C 250 40, 270 32, 290 35"
            stroke="url(#greenGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="350"
            animatedProps={greenAnimatedProps}
          />

          {/* Red line - animated stroke */}
          <AnimatedPath
            d="M 40 165 C 100 175, 160 180, 220 185 C 260 188, 280 190, 310 195"
            stroke="url(#redGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="350"
            animatedProps={redAnimatedProps}
          />

          {/* Glowing dot with pulsing animation */}
          <AnimatedCircle 
            cx="290" 
            cy="35" 
            r="16" 
            fill="url(#dotGlow)" 
            animatedProps={dotGlowProps}
          />
          <AnimatedCircle
            cx="290"
            cy="35"
            fill={COLORS.white}
            animatedProps={dotCenterProps}
          />
        </Svg>

        {/* Now Marker - ANIMATED */}
        <AnimatedView style={[styles.nowMarker, nowMarkerStyle]}>
          <View style={styles.nowLabelContainer}>
            <Text style={styles.nowText}>Now</Text>
          </View>
          <View style={styles.nowArrow} />
        </AnimatedView>

        {/* 7x Multiplier with Arrow - ANIMATED */}
        <AnimatedView style={[styles.multiplierContainer, multiplierContainerStyle]}>
          <AnimatedView style={[styles.arrow, arrowStyle]}>
            <View style={styles.arrowLine} />
            <View style={styles.arrowHead} />
          </AnimatedView>
          <Text style={styles.multiplierText}>7x</Text>
        </AnimatedView>
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
    </AnimatedView>
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
    opacity: 0.15,
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