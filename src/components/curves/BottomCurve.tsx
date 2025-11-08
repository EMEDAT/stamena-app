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

export const BottomCurve: React.FC<Props> = ({ width, height, delay = 400, duration = 1400 }) => {
  const draw = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(draw, { toValue: 1, duration, useNativeDriver: false }),
    ]).start();
  }, [delay, duration]);

  const dashOffset = draw.interpolate({
    inputRange: [0, 1],
    outputRange: [640, 0],
  });

  const pathD = 'M6 6.1253H55C185 7 264 27 324 81';
  // Original viewBox 318x76
  const scaleX = width / 318;
  const scaleY = height / 76;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient
          id="bottomCurveGradient"
          x1={2.5}
          y1={-0.743186}
          x2={310.355}
          y2={44.1036}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <Stop offset="22%" stopColor="#1AEE0F" stopOpacity={1} />
          <Stop offset="73%" stopColor="#EE0F0F" stopOpacity={1} />
          <Stop offset="100%" stopColor="#EE0F0F" stopOpacity={0} />
        </LinearGradient>
      </Defs>

      <G transform={`scale(${scaleX} ${scaleY})`}>
        <AnimatedPath
          d={pathD}
          stroke="url(#bottomCurveGradient)"
          strokeWidth={18}
          strokeLinecap="round"
          fill="none"
          strokeOpacity={0.79}
          strokeDasharray="640"
          strokeDashoffset={dashOffset}
        />
      </G>
    </Svg>
  );
};
