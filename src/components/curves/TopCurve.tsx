import React, { useEffect, useMemo, useRef } from 'react';
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
  const pathD = 'M6 112h29.029c14.695 0 29.515-1.658 43.15-7.14C159.137 72.31 169.648 6 346 6';

  const vbW = 352;
  const vbH = 118;

  const scaleX = width / vbW;
  const scaleY = height / vbH;

  const driver = (progress ?? internal) as Animated.Value;

  // Longer dash so the stroke travels fully to the end
  const baseLength = 1400;
  const dashLength = baseLength * ((width / vbW + height / vbH) / 2);

  const dashOffset = driver.interpolate({
    inputRange: [0, 1],
    outputRange: [dashLength, 0],
  });

  // Precompute samples (two cubics) in viewBox space
  const tArray = useMemo(() => Array.from({ length: 50 }, (_, i) => i / 49), []);
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
      // Second cubic (absolute C): (78.179,104.86)->(159.137,72.31)->(169.648,6)->(346,6)
      {
        x: [78.179, 159.137, 169.648, 346] as [number, number, number, number],
        y: [104.86, 72.31, 6, 6] as [number, number, number, number],
      },
    ],
    []
  );

  const split = 140 / (140 + 260); // segment weighting approx.
  const pts = useMemo(
    () =>
      tArray.map((T) => {
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
      }),
    [segs, split, tArray]
  );

  const xArray = useMemo(() => pts.map((p) => p.x), [pts]);
  const yArray = useMemo(() => pts.map((p) => p.y), [pts]);

  // Dot progress (lead ahead slightly)
  const dotLeadProgress = driver.interpolate({
    inputRange: [0, 1],
    outputRange: [lead, 1],
  });

  const movingCx = dotLeadProgress.interpolate({
    inputRange: tArray,
    outputRange: xArray,
    extrapolate: 'clamp',
  });
  const movingCy = dotLeadProgress.interpolate({
    inputRange: tArray,
    outputRange: yArray,
    extrapolate: 'clamp',
  });

  return (
    <Svg width={width} height={height + strokeW} style={{ overflow: 'visible' }}>
      <Defs>
        <LinearGradient id="topCurveGradient" x1={3} y1={104.5} x2={359.331} y2={15.3127} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#000000" stopOpacity={0} />
          <Stop offset="0.45" stopColor="#1AEE0E" stopOpacity={1} />
          <Stop offset="0.74" stopColor="#1AEE0E" stopOpacity={0.85} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </LinearGradient>
        <RadialGradient id="dotGlowTop" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <Stop offset="60%" stopColor="#1AEE0F" stopOpacity="0.30" />
          <Stop offset="100%" stopColor="#1AEE0F" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <G transform={`translate(0,${strokeW / 2}) scale(${scaleX} ${scaleY})`}>
        {/* Stroke reveal */}
        <AnimatedPath
          d={pathD}
          stroke="url(#topCurveGradient)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={dashLength}
          strokeDashoffset={dashOffset}
        />

        {/* Blinking dot that follows the curve exactly (same coordinate space) */}
        <G>
          <AnimatedCircle cx={movingCx} cy={movingCy} r={14} fill="url(#dotGlowTop)" opacity={dotOpacity ?? 1} />
          <AnimatedCircle
            cx={movingCx}
            cy={movingCy}
            r={(dotPulse ?? new Animated.Value(1)).interpolate({ inputRange: [1, 1.15], outputRange: [6, 7.5] })}
            fill="#FFFFFF"
            opacity={dotOpacity ?? 1}
          />
        </G>
      </G>
    </Svg>
  );
};
