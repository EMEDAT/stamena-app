import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PersonIconProps {
  size?: number;
  color?: string;
}

export const PersonIcon: React.FC<PersonIconProps> = ({
  size = 24,
  color = '#1AEE0F'
}) => {
  return (
    <Svg width={size} height={size * 2.18} viewBox="0 0 19 52" fill="none">
      <Path
        d="M9.5 8C11.7091 8 13.5 6.20914 13.5 4C13.5 1.79086 11.7091 0 9.5 0C7.29086 0 5.5 1.79086 5.5 4C5.5 6.20914 7.29086 8 9.5 8Z"
        fill={color}
      />
      <Path
        d="M9.5 15C9.5 15 14.5 15 14.5 20V32C14.5 32 12.5 32 9.5 32C6.5 32 4.5 32 4.5 32V20C4.5 15 9.5 15 9.5 15Z"
        fill={color}
      />
      <Path
        d="M14.5 32L16.5 52H12.5L11.5 38L9.5 52H5.5L7.5 32"
        fill={color}
      />
    </Svg>
  );
};
