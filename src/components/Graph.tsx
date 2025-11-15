import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image, Easing } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import { fontSemibold, fontMedium, fontRegular, fontBold } from '../constants/typography';
const clockIcon = require('../../assets/clock.png');
const rectangleGradient = require('../../assets/rectangleGradient.png');
const backgroundGradient = require('../../assets/backgroundGradient.png');
import { TopCurve } from './curves/TopCurve';
import { BottomCurve } from './curves/BottomCurve';
import { ArrowUp } from './icons/ArrowUp';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { width: screenWidth } = Dimensions.get('window');
const GRAPH_WIDTH = screenWidth;
const GRAPH_HEIGHT = 245;

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

  const DOT_STOP_DISTANCE = 0.79; // how far along the curve the dot should halt
  const DOT_EASE_BREAKPOINT = 0.74; // fraction of the animation where easing begins
  const DOT_TOTAL_DURATION = 1600;
  const DOT_PHASE_ONE_DURATION = Math.round(DOT_TOTAL_DURATION * DOT_EASE_BREAKPOINT);
  const DOT_PHASE_TWO_DURATION = DOT_TOTAL_DURATION - DOT_PHASE_ONE_DURATION;

  const CURVE_SYNC_PROGRESS = DOT_EASE_BREAKPOINT;
  const CURVE_FINISH_PROGRESS = 1;
  const CURVE_SYNC_DURATION = DOT_PHASE_ONE_DURATION;
  const CURVE_FINISH_DURATION = 1300;
  const DOT_LEAD = 0.316;
  const DOT_CATCHUP_POINT = DOT_EASE_BREAKPOINT;

  useEffect(() => {
    topCurveProgress.setValue(0);
    dotProgress.setValue(0);
    // Main sequence: fade + baseline + curves + dot
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, delay: 250, useNativeDriver: true }),
      Animated.spring(labelY, { toValue: 0, useNativeDriver: true }),
      Animated.timing(baselineDraw, { toValue: 1, duration: 700, useNativeDriver: false }),
      Animated.timing(bgGlowOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(dotAppear, { toValue: 1, duration: 0, useNativeDriver: false }), // dot appears immediately
      Animated.sequence([
        Animated.timing(topCurveProgress, {
          toValue: CURVE_SYNC_PROGRESS,
          duration: CURVE_SYNC_DURATION,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(topCurveProgress, {
          toValue: CURVE_FINISH_PROGRESS,
          duration: CURVE_FINISH_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.timing(dotProgress, {
          toValue: DOT_EASE_BREAKPOINT,
          duration: DOT_PHASE_ONE_DURATION,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(dotProgress, {
          toValue: 1,
          duration: DOT_PHASE_TWO_DURATION,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
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

    dotPulse.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, { toValue: 0.35, duration: 500, delay: 600, useNativeDriver: false }),
        Animated.timing(dotPulse, { toValue: 1, duration: 500, useNativeDriver: false }),
      ]),
      { iterations: 3 }
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
  const ARROW_HEIGHT = 120; // change to make the arrow taller
  const ARROW_LOWER = 45; // tweak this number to move the arrow+text down/up
  const MULTIPLIER_FONT_SIZE = 18; // adjust this to change "7x" font size
  const MULTIPLIER_TEXT_Y = -55; // positive moves "7x" lower relative to arrow base

  const nowDotX = startX + 45;
  const nowDotY = hatchY;
  const nowOuterR = 12;
  const nowInnerR = 5;

  // Determine target apex Y (between top grid line and second-to-top grid line)
  const topLineY = gridYs[gridCount - 1];
  const secondTopLineY = gridYs[gridCount - 2];
  const apexBlend = 0.38; // 0 = exactly at top line, 1 = at second line; tuned for "relaxes between"
  const targetApexY = topLineY + (secondTopLineY - topLineY) * apexBlend;

  // --- Curve positioning (add backward offset so path starts behind the dot) ---
  const CURVE_BACK_OFFSET = 28; // pixels to push the actual path start behind the visible starting dot
  const TOP_CURVE_BASE_OFFSET = 88; // matches internal padding to avoid clipping at apex
  const TOP_CURVE_STROKE_LIFT = 14; // positive raises the rendered start of the stroke
  const START_DOT_LIFT = 0; // positive raises the static start dot & bubble; tweak independently
  const topCurveYOffset = TOP_CURVE_BASE_OFFSET;
  const topCurveStrokeYOffset = topCurveYOffset - TOP_CURVE_STROKE_LIFT;

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
  const CURVE_RIGHT_NUDGE = 6; // positive → move curve right
  const topLeft = nowDotX - topScaleX * TOP_VB.startX - CURVE_BACK_OFFSET + CURVE_RIGHT_NUDGE;
  const topTop  = nowDotY - TOP_VB.startY - raiseOffset - topCurveYOffset;

  // Define bottom curve viewBox + start (fix TS error)
  const BOT_VB = { w: 318, h: 76, startX: 6, startY: 6.1253 };

  const botW = Math.round(GRAPH_WIDTH * CURVE_SCALE);
  const botH = BOT_VB.h;

  const botScaleX = botW / BOT_VB.w;
  const botScaleY = botH / BOT_VB.h;
  const botLeft = nowDotX - botScaleX * BOT_VB.startX - CURVE_BACK_OFFSET;
  const botTop  = nowDotY - botScaleY * BOT_VB.startY;

  const startPointY = nowDotY - START_DOT_LIFT;

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <View style={styles.graphWrapper}>
        <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="xAxisGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#ffffffff" stopOpacity="1" />
              <Stop offset="10%" stopColor="#ffffffff" stopOpacity="1" />
              <Stop offset="30%" stopColor="#ffffffff" stopOpacity="0.9" />
              <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <Stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.7" />
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
          <Path d={`M ${startX} ${startY} V ${topPadding - 3}`} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
          <Path d={`M ${startX - 9} ${topPadding + 6} L ${startX} ${topPadding - 6} L ${startX +9} ${topPadding + 6}`} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" fill="none" />
          <Path d={`M ${startX} ${startY} H ${endX}`} stroke="url(#xAxisGrad)" strokeWidth={3} strokeLinecap="round" />

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

        {/* Right-side gradient glow */}
        <Animated.View style={[styles.rightGradientWrapper, { opacity: bgGlowOpacity }]} pointerEvents="none">
          <Image source={backgroundGradient} style={styles.backgroundGradient} />
          <Image source={rectangleGradient} style={styles.rectangleGradient} />
        </Animated.View>

        {/* Curves */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View style={{ position: 'absolute', left: topLeft, top: topTop, width: topW, height: topH + 18, overflow: 'visible' }}>
            {/* Drive stroke + dot together; keep a tiny lead inside TopCurve */}
            <TopCurve
              width={topW}
              height={topH}
              progress={topCurveProgress}
              lead={DOT_LEAD}
              // Keep dot size constant; blink via opacity
              dotOpacity={dotPulse}
              dotProgress={dotProgress}
              dotCatchup={DOT_CATCHUP_POINT}
              dotStop={DOT_STOP_DISTANCE}
              delay={0}
              yOffset={topCurveStrokeYOffset}
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
              top: startPointY - nowOuterR,
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
        <View style={[styles.nowWrapper, { left: nowDotX - 32, top: startPointY - 62 }]}>
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 10,
  },
  clock: { width: 17, height: 17, tintColor: COLORS.white },
  labelText: {
    ...fontMedium,
    fontSize: 14,
    color: COLORS.white,
    letterSpacing: 0.8,
  },

  // Right-side gradient glow coming from the right
  rightGradientWrapper: {
    position: 'absolute',
    top: -150, // Extended up to hide top edge
    right: -250, // Extended right to hide right edge
    bottom: -150, // Extended down to hide bottom edge
    width: GRAPH_WIDTH * 1.5, // Much wider to ensure no visible edges
    height: GRAPH_HEIGHT + 300, // Much taller to hide top/bottom edges
    overflow: 'visible',
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    left: -90,
    top: -60,
  },
  rectangleGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    left: -130,
    top: -10,
  },

  // Now bubble
  nowWrapper: { position: 'absolute', alignItems: 'center' },
  nowBubble: { backgroundColor: '#404754', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8 },
  nowText: { ...fontMedium, fontSize: 13, color: COLORS.white, letterSpacing: 0.3 },
  nowArrow: {
    width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6, borderStyle: 'solid',
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#404754', marginTop: -1,
  },

  // 7x group
  multiplierGroup: { position: 'absolute', right: 40, flexDirection: 'row', alignItems: 'flex-end', zIndex: 15 },
  multiplierText: { ...fontBold, fontSize: 32, color: COLORS.white, marginLeft: 0, letterSpacing: -1 },
  arrowImage: { width: 50, height: 90 },

  // Legend container
  legendContainer: {
    alignSelf: 'center',
    marginTop: -15,
    backgroundColor: '#0A0B0C',
    borderColor: '#202126ff',
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
  legendText: { ...fontSemibold, fontSize: 15, color: COLORS.white, letterSpacing: 0.2 },

  // Starting point dot (on top of curves)
  startDot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
