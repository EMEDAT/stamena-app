import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface StarRatingProps {
  rating?: number; // 1-5
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating = 5, size = 16 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} filled={index < rating} size={size} />
      ))}
    </View>
  );
};

interface StarProps {
  filled: boolean;
  size: number;
}

const Star: React.FC<StarProps> = ({ filled, size }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {/* Background star (unfilled) */}
      {!filled && (
        <Path
          d="M8 1.33334L9.88 5.14667L14 5.74667L11 8.66667L11.76 12.76L8 10.7867L4.24 12.76L5 8.66667L2 5.74667L6.12 5.14667L8 1.33334Z"
          fill="#E9EAEB"
          stroke="#E9EAEB"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {/* Filled star */}
      {filled && (
        <Path
          d="M8 1.33334L9.88 5.14667L14 5.74667L11 8.66667L11.76 12.76L8 10.7867L4.24 12.76L5 8.66667L2 5.74667L6.12 5.14667L8 1.33334Z"
          fill="#F79009"
          stroke="#F79009"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
