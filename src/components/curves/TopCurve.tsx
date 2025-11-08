import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  width: number;
  height: number;
  delay?: number;
  duration?: number;
}

export const TopCurve: React.FC<Props> = ({ width, height, delay = 300, duration = 1500 }) => {
  const draw = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(draw, { toValue: 1, duration, useNativeDriver: false }),
    ]).start();
  }, [delay, duration]);

  const strokeW = 18; // increased from 12
  const pathD = 'M6 112h29.029c14.695 0 29.515-1.658 43.15-7.14C159.137 72.31 169.648 6 346 6'; // same shape

  // Original viewBox
  const vbW = 352;
  const vbH = 118;

  // Horizontal scale only (avoid vertical clipping)
  const scaleX = width / vbW;
  const scaleY = height / vbH;

  // Add vertical padding to prevent top clipping
  const paddedHeight = height + strokeW;
  const verticalOffset = strokeW / 2;

  // Adjust dash length so reveal is smooth when scaled
  const baseLength = 800;
  const dashLength = baseLength * ((width / 352 + height / 118) / 2);

  const dashOffset = draw.interpolate({
    inputRange: [0, 1],
    outputRange: [dashLength, 0],
  });

  return (
    <Svg width={width} height={height + strokeW} style={{ overflow: 'visible' }}>
      <Defs>
        <LinearGradient id="topCurveGradient" x1={3} y1={104.5} x2={359.331} y2={15.3127} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#000000" stopOpacity={0} />
          <Stop offset="0.45" stopColor="#1AEE0E" stopOpacity={1} />
          <Stop offset="0.84" stopColor="#1AEE0E" stopOpacity={0.5} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <G transform={`translate(0,${verticalOffset}) scale(${scaleX} ${scaleY})`}>
        <AnimatedPath
          d={pathD}
          stroke="url(#topCurveGradient)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={dashLength}
          strokeDashoffset={dashOffset}
        />
      </G>
    </Svg>
  );
};
