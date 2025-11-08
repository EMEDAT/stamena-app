import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
  delay?: number; // kept for API compatibility (unused now)
  duration?: number; // kept for API compatibility (unused now)
};

export const ArrowUp: React.FC<Props> = ({
  width = 34,
  height = 112,
  delay = 0,
  duration = 700,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 34 112" fill="none" pointerEvents="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_1_20232"
          x1={16.7949}
          y1={-0.00122071}
          x2={16.7949}
          y2={72.5701}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="white" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path
        d="M15.1602 0.286621C16.2159 -0.0955694 17.372 -0.095589 18.4277 0.286621C19.6309 0.722201 20.6397 1.91287 22.6562 4.29541L28.4385 11.1284C31.8469 15.1554 33.552 17.1687 33.5869 18.8716C33.6172 20.3517 32.9628 21.7636 31.8135 22.6968C30.5526 23.7205 28.0949 23.7668 23.2949 23.769V111.37H10.2949V23.769C5.49358 23.7668 3.03548 23.7206 1.77441 22.6968C0.625095 21.7636 -0.0292808 20.3517 0.000976562 18.8716C0.0358959 17.1688 1.74021 15.1552 5.14844 11.1284L10.9316 4.29541C12.9482 1.9129 13.957 0.722198 15.1602 0.286621Z"
        fill="url(#paint0_linear_1_20232)"
      />
    </Svg>
  );
};
