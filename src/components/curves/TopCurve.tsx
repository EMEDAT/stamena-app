import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, G, RadialGradient, Circle } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  width: number;
  height: number;
  delay?: number;
  duration?: number;
  // External driver (0..1) to sync with blinking dot
  progress?: Animated.Value | Animated.AnimatedInterpolation<number>;
  // Optional tiny lead ahead of stroke (0..1)
  lead?: number;
  // Optional pulsing for inner dot size
  dotPulse?: Animated.Value;
  // Optional opacity driver for the dot
  dotOpacity?: Animated.Value;
  dotProgress?: Animated.Value | Animated.AnimatedInterpolation<number>;
  dotXOffset?: number; // pixel shift to align start when curve is shifted left
  yOffset?: number; // positive value adds top padding inside the svg
}

export const TopCurve: React.FC<Props> = ({
  width,
  height,
  delay = 300,
  duration = 1500,
  progress,
  lead = 0.06,
  dotPulse,
  dotOpacity,
  dotProgress,
  dotXOffset = 0,
  yOffset = 0,
}) => {
  const internal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (progress) return;
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(internal, { toValue: 1, duration, useNativeDriver: false }),
    ]).start();
  }, [delay, duration, progress]);

  const strokeW = 18;
  // Same path as used in Graph (with initial h & c then absolute C)
  const pathD = 'M6 112h29.029c14.695 0 29.515-1.658 43.15-7.14C159.137 72.31 174-12 390-10h44';

  const vbW = 350;
  const vbH = 124;

  const scaleX = width / vbW;
  const scaleY = height / vbH;

  const strokeDriver = (progress ?? internal) as Animated.Value;
  const pathTravelFactor = 0.85; // dot stops at 85% of path

  // Base driver for dot (external override wins). Clamp to finish early so stroke can keep flowing.
  const dotBase = (dotProgress ?? strokeDriver) as Animated.Value;
  const aheadDriver = dotBase.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [0, 1, 1],
    extrapolate: 'clamp',
  });

  const leadOffset = dotBase.interpolate({
    inputRange: [0, 0.05, 1],
    outputRange: [0, lead, lead],
    extrapolate: 'clamp',
  });

  const rawDotDriver = Animated.add(aheadDriver, leadOffset);

  const dotDriver = rawDotDriver.interpolate({
    inputRange: [0, 1 + lead],
    outputRange: [0, pathTravelFactor],
    extrapolate: 'clamp',
  });

  // Precompute samples (two cubics) in viewBox space so we can measure the path length dynamically
  const tArray = useMemo(() => Array.from({ length: 60 }, (_, i) => i / 59), []);
  const cubic = (p0: number, p1: number, p2: number, p3: number, t: number) =>
    (1 - t) ** 3 * p0 +
    3 * (1 - t) ** 2 * t * p1 +
    3 * (1 - t) * t ** 2 * p2 +
    t ** 3 * p3;

  const segs = useMemo(
    () => [
      // First cubic (combine H+first C): (6,112)->(35.029,112)->(49.724,112)->(78.179,104.86)
      {
        x: [6, 35.029, 49.724, 78.179] as [number, number, number, number],
        y: [112, 112, 110.342, 104.86] as [number, number, number, number],
      },
      // Second cubic (absolute C): (78.179,104.86)->(159.137,72.31)->(174,-12)->(390,-10)
      {
        x: [78.179, 159.137, 174, 390] as [number, number, number, number],
        y: [104.86, 72.31, -12, -10] as [number, number, number, number],
      },
    ],
    []
  );

  const split = 140 / (140 + 320); // segment weighting approx. for new tail
  const getPoint = useCallback(
    (T: number) => {
      if (T <= split) {
        const s = T / split;
        const [x0, x1, x2, x3] = segs[0].x;
        const [y0, y1, y2, y3] = segs[0].y;
        return { x: cubic(x0, x1, x2, x3, s), y: cubic(y0, y1, y2, y3, s) };
      }
      const s = (T - split) / (1 - split);
      const [x0, x1, x2, x3] = segs[1].x;
      const [y0, y1, y2, y3] = segs[1].y;
      return { x: cubic(x0, x1, x2, x3, s), y: cubic(y0, y1, y2, y3, s) };
    },
    [segs, split]
  );

  const pts = useMemo(() => tArray.map((T) => getPoint(T)), [getPoint, tArray]);

  const xArray = useMemo(() => pts.map((p) => p.x), [pts]);
  const yArray = useMemo(() => pts.map((p) => p.y), [pts]);

  // Compute total stroke length in the rendered coordinate space so the dash reaches the end
  const dashLength = useMemo(() => {
    const steps = 360;
    let total = 0;
    let prev = getPoint(0);
    let prevX = prev.x * scaleX;
    let prevY = prev.y * scaleY;

    for (let i = 1; i < steps; i++) {
      const point = getPoint(i / (steps - 1));
      const x = point.x * scaleX;
      const y = point.y * scaleY;
      total += Math.hypot(x - prevX, y - prevY);
      prevX = x;
      prevY = y;
    }

    const margin = Math.max(strokeW * 2.6, width * 0.22);
    return total + margin;
  }, [getPoint, scaleX, scaleY, strokeW, width]);

  const dashOffset = strokeDriver.interpolate({
    inputRange: [0, 1],
    outputRange: [dashLength, 0],
  });

  const movingCx = dotDriver.interpolate({
    inputRange: tArray,
    outputRange: xArray,
    extrapolate: 'clamp',
  });
  const movingCy = dotDriver.interpolate({
    inputRange: tArray,
    outputRange: yArray,
    extrapolate: 'clamp',
  });

  // Convert path (viewBox) coords to pixel coords for the dot (drawn outside scale)
  const xArrayPx = useMemo(() => xArray.map((x) => x * scaleX + dotXOffset), [xArray, scaleX, dotXOffset]);
  const yArrayPx = useMemo(() => yArray.map((y) => y + strokeW / 2 + yOffset), [yArray, strokeW, yOffset]);
  const movingCxPx = dotDriver.interpolate({ inputRange: tArray, outputRange: xArrayPx, extrapolate: 'clamp' });
  const movingCyPx = dotDriver.interpolate({ inputRange: tArray, outputRange: yArrayPx, extrapolate: 'clamp' });

  const svgHeight = height + strokeW + yOffset;

  return (
    <Svg width={width} height={svgHeight} style={{ overflow: 'visible' }}>
      <Defs>
        <LinearGradient
          id="topCurveGradient"
          x1={3}
          y1={104.5}
          x2={359.331}
          y2={15.3127}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#000000" stopOpacity={0} />
          <Stop offset="0.5" stopColor="#1AEE0E" stopOpacity={1} />
          <Stop offset="0.58" stopColor="#1AEE0E" stopOpacity={0.9} />
          <Stop offset="0.65" stopColor="#1AEE0E" stopOpacity={0.9} />
          <Stop offset="0.75" stopColor="#287d22ff" stopOpacity={0.75} />
          <Stop offset="0.8" stopColor="#287d22ff" stopOpacity={0.5} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </LinearGradient>
        <RadialGradient id="dotGlowTop" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <Stop offset="60%" stopColor="#1AEE0F" stopOpacity="0.5" />
          <Stop offset="100%" stopColor="#1AEE0F" stopOpacity="0.2" />
        </RadialGradient>
      </Defs>

      {/* Scaled path group */}
      <G transform={`translate(0,${strokeW / 2 + yOffset}) scale(${scaleX} ${scaleY})`}>
        <AnimatedPath
          d={pathD}
          stroke="url(#topCurveGradient)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={[dashLength, dashLength]}
          strokeDashoffset={dashOffset}
        />
      </G>

      {/* Dot over the stroke in pixel space */}
      <G>
    <AnimatedCircle cx={movingCxPx} cy={movingCyPx} r={16.5} fill="url(#dotGlowTop)" opacity={1} />
    <AnimatedCircle cx={movingCxPx} cy={movingCyPx} r={10} fill="#FFFFFF" opacity={dotOpacity ?? 1} />
      </G>
    </Svg>
  );
};