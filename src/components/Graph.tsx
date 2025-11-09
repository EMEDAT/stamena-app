import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image, Easing } from 'react-native';
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
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textX = useRef(new Animated.Value(10)).current;
  const bgGlowOpacity = useRef(new Animated.Value(0)).current;
  const topCurveProgress = useRef(new Animated.Value(0)).current;
  const dotProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    topCurveProgress.setValue(0);
    dotProgress.setValue(0);
    // Main sequence: fade + baseline + curves + dot
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, delay: 250, useNativeDriver: true }),
      Animated.spring(labelY, { toValue: 0, useNativeDriver: true }),
      Animated.timing(baselineDraw, { toValue: 1, duration: 700, useNativeDriver: false }),
      Animated.timing(bgGlowOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(dotAppear, { toValue: 1, duration: 0, useNativeDriver: false }),          // dot appears immediately
      Animated.timing(topCurveProgress, {
        toValue: 1,
        duration: 1770,
        easing: Easing.linear,
        useNativeDriver: false,
      }), // top curve stroke (slower so dot leads)
      Animated.timing(dotProgress, {
        toValue: 1,
        duration: 1530,
        easing: Easing.linear,
        useNativeDriver: false,
      }), // faster dot travel
    ]).start();

    // Arrow appears first, then "7x" types-on (fade + slide) shortly after
    Animated.sequence([
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(arrowY, { toValue: 0, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(arrowOpacity, { toValue: 1, duration: 480, useNativeDriver: true }),
        Animated.timing(multiplierOpacity, { toValue: 1, duration: 480, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(textX, { toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();

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
  // Adjust how far DOWN the arrow+7x sits relative to the hatch line.
  // Positive value moves it lower (toward the bottom of the screen).
  const ARROW_WIDTH = 45;  // change to make the arrow wider
  const ARROW_HEIGHT = 125; // change to make the arrow taller
  const ARROW_LOWER = 45; // tweak this number to move the arrow+text down/up
  const MULTIPLIER_FONT_SIZE = 18; // adjust this to change "7x" font size
  const MULTIPLIER_TEXT_Y = -55; // positive moves "7x" lower relative to arrow base

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
  const TOP_CURVE_Y_OFFSET = 18; // matches internal padding to avoid clipping at apex

  // Curve sizing (remove vertical scaling math that could clip)
  const TOP_VB = { w: 350, h: 124, startX: 6, startY: 108 };
  const CURVE_SCALE = 0.78;
  const topW = Math.round(GRAPH_WIDTH * CURVE_SCALE);
  const topH = TOP_VB.h; // keep original height; TopCurve adds its own padding
  // Position so start point lines up with nowDot
  const topScaleX = topW / TOP_VB.w;

  // Original apex Y without adjustment: apexY = nowDotY - 106 (since apex is y=6 and start is y=112)
  const originalApexY = nowDotY - 106;
  const raiseOffset = originalApexY - targetApexY; // positive => move curve up
  // Apply raise: shift entire curve upward by raiseOffset
  const CURVE_RIGHT_NUDGE = 26; // positive → move curve right
  const topLeft = nowDotX - topScaleX * TOP_VB.startX - CURVE_BACK_OFFSET + CURVE_RIGHT_NUDGE;
  const topTop  = nowDotY - TOP_VB.startY - raiseOffset - TOP_CURVE_Y_OFFSET;

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
    // Second cubic: from (78.179,104.86) -> (390,-10)
    { x: [78.179, 159.137, 174, 390] as [number, number, number, number],
      y: [104.86, 72.31, -12, -10] as [number, number, number, number] },
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
              <Stop offset="0%" stopColor="#ffffffff" stopOpacity="0.9" />
              <Stop offset="10%" stopColor="#ffffffff" stopOpacity="0.75" />
              <Stop offset="30%" stopColor="#ffffffff" stopOpacity="0.55" />
              <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="70%" stopColor="#FFFFFF" stopOpacity="1" />
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

          {/* Removed old moving-dot block here; dot is now inside TopCurve */}
        </Svg>

        {/* Right-side bright glow */}
        <Animated.View style={[styles.bgGlowWrapper, { opacity: bgGlowOpacity }]}> 
          <Image source={bgGlow} style={[styles.bgGlow, { opacity: 1 }]} resizeMode="cover" />
        </Animated.View>
        {/* Secondary soft glow */}
        <Animated.View style={[styles.bgGlowWrapper, styles.bgGlowWrapperMid, { opacity: bgGlowOpacity }]}> 
          <Image source={bgGlow} style={[styles.bgGlow, { opacity: 0.8 }]} resizeMode="cover" />
        </Animated.View>
        {/* Bottom-muted glow */}
        <Animated.View style={[styles.bgGlowWrapperLow, { opacity: bgGlowOpacity }]}> 
          <Image source={bgGlow} style={[styles.bgGlow, { opacity: 0.1 }]} resizeMode="cover" />
        </Animated.View>

        {/* Curves */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View style={{ position: 'absolute', left: topLeft, top: topTop, width: topW, height: topH + 18, overflow: 'visible' }}>
            {/* Drive stroke + dot together; keep a tiny lead inside TopCurve */}
            <TopCurve
              width={topW}
              height={topH}
              progress={topCurveProgress}
              lead={0.06}
              // Keep dot size constant; blink via opacity
              dotOpacity={dotPulse}
              dotProgress={dotProgress}
              delay={0}
              yOffset={TOP_CURVE_Y_OFFSET}
            />
          </View>
          <View style={{ position: 'absolute', left: botLeft, top: botTop, width: botW, height: botH }}>
            <BottomCurve width={botW} height={botH} delay={0} duration={2300} />
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

        {/* Arrow + multiplier (arrow bottom sits just above hatched line) */}
        <Animated.View
          style={[
            styles.multiplierGroup,
            {
              opacity: multiplierOpacity,
              transform: [{ translateY: arrowY }],
              top: hatchY - ARROW_HEIGHT - 4 + ARROW_LOWER, // bottom of arrow sits just above hatch
            },
          ]}
        >
          <Animated.View style={{ opacity: arrowOpacity }}>
            <ArrowUp width={ARROW_WIDTH} height={ARROW_HEIGHT} delay={0} />
          </Animated.View>
          <Animated.Text
            style={[
              styles.multiplierText,
              {
                fontSize: MULTIPLIER_FONT_SIZE,
                opacity: textOpacity,
                transform: [{ translateX: textX }, { translateY: MULTIPLIER_TEXT_Y }],
              },
            ]}
          >
            7x
          </Animated.Text>
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
  <View style={[styles.legendContainer, { width: GRAPH_WIDTH - 32 }]}> 
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: COLORS.brandGreen }]} />
            <Text style={styles.legendText}>With Kegels</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: COLORS.brandRed }]} />
            <Text style={styles.legendText}>No Kegels</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // bring graph down away from headline
    marginTop: 14,
    marginBottom: 0,
    overflow: 'visible',
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  clock: { width: 17, height: 17, tintColor: COLORS.white },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
    letterSpacing: 0.2,
  },

  // Bright right-side glow larger coverage
  bgGlowWrapper: {
    position: 'absolute',
    top: -100,
    right: -20,
    bottom: -10,
    left: -10,
    width: '120%',
  },
  bgGlowWrapperMid: {
    top: -160,
    right: -50,
    bottom: -10,
    left: -50,
  },
  bgGlowWrapperLow: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 1000,
  },
  bgGlow: { width: '100%', height: '120%' },

  // Now bubble
  nowWrapper: { position: 'absolute', alignItems: 'center' },
  nowBubble: { backgroundColor: '#404754', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8 },
  nowText: { fontSize: 13, fontWeight: '500', color: COLORS.white, letterSpacing: 0.3 },
  nowArrow: {
    width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6, borderStyle: 'solid',
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#404754', marginTop: -1,
  },

  // 7x group
  multiplierGroup: { position: 'absolute', right: 40, flexDirection: 'row', alignItems: 'flex-end', zIndex: 15 },
  multiplierText: { fontSize: 32, fontWeight: '700', color: COLORS.white, marginLeft: 0, letterSpacing: -1 },
  arrowImage: { width: 50, height: 90 },

  // Legend container
  legendContainer: {
    alignSelf: 'center',
    marginTop: 0,
    backgroundColor: COLORS.gray[900],
    borderColor: COLORS.gray[850],
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    width: '100%',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendSwatch: { width: 16, height: 16, borderRadius: 5 },
  legendText: { fontSize: 15, fontWeight: '600', color: COLORS.white, letterSpacing: 0.2 },

  // Starting point dot (on top of curves)
  startDot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
