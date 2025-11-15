import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface UserIconProps {
  size?: number;
  color?: string;
}

export const UserIcon: React.FC<UserIconProps> = ({ size = 16, color = '#FFFFFF' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 17 17" fill="none">
      <Path
        d="M8.33337 8.33333C9.71409 8.33333 10.8334 7.21405 10.8334 5.83333C10.8334 4.45262 9.71409 3.33333 8.33337 3.33333C6.95266 3.33333 5.83337 4.45262 5.83337 5.83333C5.83337 7.21405 6.95266 8.33333 8.33337 8.33333Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.9167 13.6667C12.9167 12.0076 10.8334 10.6667 8.33337 10.6667C5.83337 10.6667 3.75004 12.0076 3.75004 13.6667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
