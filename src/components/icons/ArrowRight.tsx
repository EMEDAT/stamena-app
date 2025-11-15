import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ArrowRightProps {
  size?: number;
  color?: string;
}

export const ArrowRight: React.FC<ArrowRightProps> = ({ size = 16, color = '#FFFFFF' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 17 17" fill="none">
      <Path
        d="M3.54163 8.5H13.4583M13.4583 8.5L8.49996 3.54167M13.4583 8.5L8.49996 13.4583"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
