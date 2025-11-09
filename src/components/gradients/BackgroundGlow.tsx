import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, {
  G,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  Filter,
  FeGaussianBlur,
  RadialGradient,
} from 'react-native-svg';

export type BackgroundGlowProps = {
  width?: number | string;
  height?: number | string;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
  centerFillOpacity?: number;
  midFillOpacity?: number;
  edgeFillOpacity?: number;
  strokeOpacity?: number;
  strokeWidth?: number;
  blurDeviation?: number;
  verticalScale?: number;
};

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({
  width = '100%',
  height = '100%',
  opacity = 1,
  style,
  centerFillOpacity = 0.92,
  midFillOpacity = 0.24,
  edgeFillOpacity = 0,
  strokeOpacity = 0,
  strokeWidth = 1.6,
  blurDeviation = 128,
  verticalScale = 0.9,
}) => {
  const baseRx = 146.179;
  const baseRy = 143.682;
  const sizeBoost = 1.12;
  const horizontalScale = 1.18;
  const scaledRx = baseRx * horizontalScale * sizeBoost;
  const scaledRy = baseRy * verticalScale * sizeBoost;
  const centerX = 195;
  const centerY = 255;
  const verticalOffset = 0;
  const rotation = -70;
  

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 332 459"
      preserveAspectRatio="xMidYMid slice"
      style={style}
    >
      <Defs>
        <RadialGradient
          id="backgroundGlowFill"
          cx={centerX}
          cy={centerY + verticalOffset}
          r={scaledRy * 1.12}
          gradientUnits="userSpaceOnUse"
          gradientTransform={`rotate(${rotation * -1.2} ${centerX} ${centerY}) scale(${horizontalScale * sizeBoost} ${verticalScale * sizeBoost})`}
          fx={centerX + 88}
          fy={centerY - 18}
        >
          <Stop offset="0" stopColor="#68FF54" stopOpacity={Math.min(centerFillOpacity, 1)} />
          <Stop offset="0.42" stopColor="#24EF0D" stopOpacity={Math.min(centerFillOpacity * 0.95, 1)} />
          <Stop offset="0.7" stopColor="#28ca49ff" stopOpacity={Math.min(midFillOpacity * 0.32, 0.32)} />
          <Stop offset="1" stopColor="#000000" stopOpacity={edgeFillOpacity} />
        </RadialGradient>
        <LinearGradient
          id="backgroundGlowStroke"
          x1="419.579"
          y1="186.703"
          x2="103.37"
          y2="271.431"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </LinearGradient>
        <Filter
          id="backgroundGlowBlur"
          x="-45%"
          y="-45%"
          width="190%"
          height="190%"
          filterUnits="objectBoundingBox"
        >
          <FeGaussianBlur stdDeviation={blurDeviation} />
        </Filter>
      </Defs>
      <G opacity={opacity} filter="url(#backgroundGlowBlur)">
        <Ellipse
          cx={centerX}
          cy={centerY}
          rx={scaledRx}
          ry={scaledRy}
          transform={`rotate(${rotation} ${centerX} ${centerY})`}
          fill="url(#backgroundGlowFill)"
        />
        {strokeOpacity > 0 && strokeWidth > 0 && (
          <Ellipse
            cx={centerX}
            cy={centerY}
            rx={scaledRx}
            ry={scaledRy}
            transform={`rotate(${rotation} ${centerX} ${centerY})`}
            fill="none"
            stroke="url(#backgroundGlowStroke)"
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
          />
        )}
      </G>
    </Svg>
  );
};
