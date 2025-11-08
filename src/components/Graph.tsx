import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G, RadialGradient } from 'react-native-svg';
import { COLORS } from '../constants/colors';
const bgGlow = require('../../assets/backgroundGradient.png');
const clockIcon = require('../../assets/clock.png');
import { TopCurve } from './curves/TopCurve';
import { BottomCurve } from './curves/BottomCurve';
import { ArrowUp } from './icons/ArrowUp';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width: screenWidth } = Dimensions.get('window');
const GRAPH_WIDTH = screenWidth;
const GRAPH_HEIGHT = 270;

export const Graph: React.FC = () => {
  // Animation values
  const fade = useRef(new Animated.Value(0)).current;
  const labelY = useRef(new Animated.Value(-20)).current;
  const baselineDraw = useRef(new Animated.Value(0)).current;
  const dotAppear = useRef(new Animated.Value(0)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const arrowY = useRef(new Animated.Value(40)).current;
  const arrowOpacity = useRef(new Animated.Value(0)).current;
  const multiplierOpacity = useRef(new Animated.Value(0)).current;
  const bgGlowOpacity = useRef(new Animated.Value(0)).current;
  const topCurveProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, delay: 250, useNativeDriver: true }),
      Animated.spring(labelY, { toValue: 0, useNativeDriver: true }),
      Animated.timing(baselineDraw, { toValue: 1, duration: 700, useNativeDriver: false }),
      Animated.timing(bgGlowOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(dotAppear, { toValue: 1, duration: 0, useNativeDriver: false }),          // dot appears immediately
      Animated.timing(topCurveProgress, { toValue: 1, duration: 1500, useNativeDriver: false }), // top curve stroke
    ]).start(() => {
      // Arrow & multiplier after curves start
      Animated.parallel([
        Animated.spring(arrowY, { toValue: 0, useNativeDriver: true }),
        Animated.timing(arrowOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(multiplierOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    });

    // Dot pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, { toValue: 1.15, duration: 900, useNativeDriver: false }),
        Animated.timing(dotPulse, { toValue: 1, duration: 900, useNativeDriver: false }),
      ])
    ).start();

    // Glow breathing
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(glowPulse, { toValue: 0, duration: 1400, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // Layout
  const startX = 18;
  const endX = GRAPH_WIDTH - 20;
  const startY = GRAPH_HEIGHT - 38;

  const topPadding = 8;
  const gridCount = 5;
  const gridSpacing = (startY - topPadding) / gridCount;
  const gridYs = Array.from({ length: gridCount }, (_, i) => startY - (i + 1) * gridSpacing);
  const hatchY = gridYs[1];

  const nowDotX = startX + 45;
  const nowDotY = hatchY;
  const nowOuterR = 14;
  const nowInnerR = 7;

  // Determine target apex Y (between top grid line and second-to-top grid line)
  const topLineY = gridYs[gridCount - 1];
  const secondTopLineY = gridYs[gridCount - 2];
  const apexBlend = 0.38; // 0 = exactly at top line, 1 = at second line; tuned for "relaxes between"
  const targetApexY = topLineY + (secondTopLineY - topLineY) * apexBlend;

  // --- Curve positioning (add backward offset so path starts behind the dot) ---
  const CURVE_BACK_OFFSET = 28; // pixels to push the actual path start behind the visible starting dot

  // Curve sizing (remove vertical scaling math that could clip)
  const TOP_VB = { w: 352, h: 118, startX: 6, startY: 112 };
  const CURVE_SCALE = 0.78;
  const topW = Math.round(GRAPH_WIDTH * CURVE_SCALE);
  const topH = TOP_VB.h; // keep original height; TopCurve adds its own padding
  // Position so start point lines up with nowDot
  const topScaleX = topW / TOP_VB.w;

  // Original apex Y without adjustment: apexY = nowDotY - 106 (since apex is y=6 and start is y=112)
  const originalApexY = nowDotY - 106;
  const raiseOffset = originalApexY - targetApexY; // positive => move curve up
  // Apply raise: shift entire curve upward by raiseOffset
  const topLeft = nowDotX - topScaleX * TOP_VB.startX - CURVE_BACK_OFFSET;
  const topTop  = nowDotY - TOP_VB.startY - raiseOffset;

  // Define bottom curve viewBox + start (fix TS error)
  const BOT_VB = { w: 318, h: 76, startX: 6, startY: 6.1253 };

  const botW = Math.round(GRAPH_WIDTH * CURVE_SCALE);
  const botH = BOT_VB.h;

  const botScaleX = botW / BOT_VB.w;
  const botScaleY = botH / BOT_VB.h;
  const botLeft = nowDotX - botScaleX * BOT_VB.startX - CURVE_BACK_OFFSET;
  const botTop  = nowDotY - botScaleY * BOT_VB.startY;

  // Use the exact path structure of TopCurve for the moving dot:
  // M6 112 H35.029 C49.724 112 64.544 110.342 78.179 104.86 C159.137 72.31 169.648 6 346 6
  // Combine H + first C into a single cubic, then the second C as-is.
  const cubic = (p0: number, p1: number, p2: number, p3: number, t: number) =>
    (1 - t) ** 3 * p0 +
    3 * (1 - t) ** 2 * t * p1 +
    3 * (1 - t) * t ** 2 * p2 +
    t ** 3 * p3;

  const segs = [
    // First cubic: from (6,112) -> (78.179,104.86)
    { x: [6, 35.029, 49.724, 78.179] as [number, number, number, number],
      y: [112, 112, 110.342, 104.86] as [number, number, number, number] },
    // Second cubic: from (78.179,104.86) -> (346,6)
    { x: [78.179, 159.137, 169.648, 346] as [number, number, number, number],
      y: [104.86, 72.31, 6, 6] as [number, number, number, number] },
  ];

  const samples = 40;
  const tArray = Array.from({ length: samples }, (_, i) => i / (samples - 1));
  // Approximate segment weights so timing feels even
  const len1 = 140, len2 = 260, totalLen = len1 + len2;
  const split = len1 / totalLen;

  const pts = tArray.map((T) => {
    if (T <= split) {
      const s = T / split;
      const [x0, x1, x2, x3] = segs[0].x;
      const [y0, y1, y2, y3] = segs[0].y;
      return { x: cubic(x0, x1, x2, x3, s), y: cubic(y0, y1, y2, y3, s) };
    } else {
      const s = (T - split) / (1 - split);
      const [x0, x1, x2, x3] = segs[1].x;
      const [y0, y1, y2, y3] = segs[1].y;
      return { x: cubic(x0, x1, x2, x3, s), y: cubic(y0, y1, y2, y3, s) };
    }
  });

  const dotXArray = pts.map(p => topLeft + p.x * topScaleX);
  const dotYArray = pts.map(p => topTop + p.y);

  // Keep the blinking dot slightly ahead of the curve head
  const DOT_LEAD = 0.06;
  const dotLeadProgress = topCurveProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [DOT_LEAD, 1],
  });

  const movingCx = dotLeadProgress.interpolate({
    inputRange: tArray,
    outputRange: dotXArray.map(x => x + CURVE_BACK_OFFSET), // align to visible starting dot
    extrapolate: 'clamp',
  });
  const movingCy = dotLeadProgress.interpolate({
    inputRange: tArray,
    outputRange: dotYArray,
    extrapolate: 'clamp',
  });

  const glowRadius = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 18],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <View style={styles.graphWrapper}>
        <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <RadialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <Stop offset="60%" stopColor="#1AEE0F" stopOpacity="0.30" />
              <Stop offset="100%" stopColor="#1AEE0F" stopOpacity="0" />
            </RadialGradient>
            <LinearGradient id="xAxisGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </LinearGradient>
            <LinearGradient id="gridLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#000000" stopOpacity={1} />
              <Stop offset="30%" stopColor="#2A2F37" stopOpacity={1} />
              <Stop offset="70%" stopColor="#2A2F37" stopOpacity={1} />
              <Stop offset="100%" stopColor="#000000" stopOpacity={1} />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {gridYs.map((y, i) => (
            <Path key={i} d={`M ${startX} ${y} H ${endX}`} stroke="url(#gridLineGrad)" strokeWidth={1} />
          ))}

          {/* Axes */}
          <Path d={`M ${startX} ${startY} V ${topPadding - 3}`} stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
          <Path d={`M ${startX - 9} ${topPadding + 6} L ${startX} ${topPadding - 6} L ${startX +9} ${topPadding + 6}`} stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" fill="none" />
          <Path d={`M ${startX} ${startY} H ${endX}`} stroke="url(#xAxisGrad)" strokeWidth={2} strokeLinecap="round" />

          {/* Hatched line */}
          <AnimatedPath
            d={`M ${startX} ${hatchY} H ${endX}`}
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="14.2 14.2"
            strokeDashoffset={baselineDraw.interpolate({ inputRange: [0, 1], outputRange: [220, 0] })}
            opacity={1}
          />

          {/* Moving glow dot along top curve (leads the stroke) */}
          <G>
            <AnimatedCircle cx={movingCx} cy={movingCy} r={glowRadius} fill="url(#dotGlow)" opacity={dotAppear} />
            <AnimatedCircle
              cx={movingCx}
              cy={movingCy}
              r={dotPulse.interpolate({ inputRange: [1, 1.15], outputRange: [6, 7.5] })}
              fill="#FFFFFF"
              opacity={dotAppear}
            />
          </G>

          {/* Starting point icon in SVG (removed to avoid being under curves) */}
        </Svg>

        {/* Right-side bright glow */}
        <Animated.View style={[styles.bgGlowWrapper, { opacity: bgGlowOpacity }]}>
          <Image source={bgGlow} style={styles.bgGlow} resizeMode="cover" />
        </Animated.View>

        {/* Curves */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View style={{ position: 'absolute', left: topLeft, top: topTop, width: topW, height: topH + 18, overflow: 'visible' }}>
            <TopCurve width={topW} height={topH} progress={topCurveProgress} delay={0} />
          </View>
          <View style={{ position: 'absolute', left: botLeft, top: botTop, width: botW, height: botH }}>
            <BottomCurve width={botW} height={botH} delay={0} duration={1550} />
          </View>
        </View>

        {/* Starting point icon on top of curves (fully opaque) */}
        <View
          pointerEvents="none"
          style={[
            styles.startDot,
            {
              left: nowDotX - nowOuterR,
              top: nowDotY - nowOuterR,
              width: nowOuterR * 2,
              height: nowOuterR * 2,
              borderRadius: nowOuterR,
              backgroundColor: '#3F4650',
            },
          ]}
        >
          <View
            style={{
              width: nowInnerR * 2,
              height: nowInnerR * 2,
              borderRadius: nowInnerR,
              backgroundColor: '#FFFFFF',
            }}
          />
        </View>

        {/* Now bubble */}
        <View style={[styles.nowWrapper, { left: nowDotX - 32, top: nowDotY - 62 }]}>
          <View style={styles.nowBubble}>
            <Text style={styles.nowText}>Now</Text>
          </View>
          <View style={styles.nowArrow} />
        </View>

        {/* Arrow + multiplier */}
        <Animated.View
          style={[
            styles.multiplierGroup,
            { opacity: multiplierOpacity, transform: [{ translateY: arrowY }], top: hatchY - 68 },
          ]}
        >
          <Animated.View style={{ opacity: arrowOpacity }}>
            <ArrowUp width={34} height={112} delay={300} />
          </Animated.View>
          <Text style={styles.multiplierText}>7x</Text>
        </Animated.View>

        {/* Sex duration label */}
        <Animated.View
          style={[
            styles.label,
            { position: 'absolute', left: startX + 40, top: gridYs[gridCount - 1] - 20, transform: [{ translateY: labelY }] },
          ]}
        >
          <Image source={clockIcon} style={styles.clock} />
          <Text style={styles.labelText}>Sex duration</Text>
        </Animated.View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: COLORS.brandGreen }]} />
          <Text style={styles.legendText}>With Kegels</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: COLORS.brandRed }]} />
          <Text style={styles.legendText}>No Kegels</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // bring graph down away from headline
    marginTop: 24,
    marginBottom: 20,
  },
  graphWrapper: {
    height: GRAPH_HEIGHT,
    width: GRAPH_WIDTH,
    // marginHorizontal: -16, // removed to avoid full-bleed
    alignSelf: 'center',
    position: 'relative',
    overflow: 'visible',
  },

  // Label bubble
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14171F',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
  },
  clock: { width: 16, height: 16, tintColor: COLORS.white },
  labelText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.2,
  },

  // Bright right-side glow larger coverage
  bgGlowWrapper: {
    position: 'absolute',
    top: -12,
    right: -16,
    bottom: -12,
    width: '85%',
  },
  bgGlow: { width: '100%', height: '100%' },

  // Now bubble
  nowWrapper: { position: 'absolute', alignItems: 'center' },
  nowBubble: { backgroundColor: '#404754', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8 },
  nowText: { fontSize: 13, fontWeight: '500', color: COLORS.white, letterSpacing: 0.3 },
  nowArrow: {
    width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6, borderStyle: 'solid',
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#404754', marginTop: -1,
  },

  // 7x group
  multiplierGroup: { position: 'absolute', right: 32, alignItems: 'center' },
  multiplierText: { fontSize: 32, fontWeight: '700', color: COLORS.white, marginTop: 4, letterSpacing: -1 },
  arrowImage: { width: 50, height: 90 },

  // Legend (unchanged)
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 32, marginTop: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendSwatch: { width: 16, height: 16, borderRadius: 5 },
  legendText: { fontSize: 15, fontWeight: '600', color: COLORS.white, letterSpacing: 0.2 },

  // Starting point dot (on top of curves)
  startDot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});