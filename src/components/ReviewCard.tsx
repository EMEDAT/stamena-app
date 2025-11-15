import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { fontSemibold, fontRegular } from '../constants/typography';
import { StarRating } from './StarRating';

interface ReviewCardProps {
  title: string;
  author: string;
  review: string;
  rating?: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  title,
  author,
  review,
  rating = 5,
}) => {
  return (
    <LinearGradient
      colors={['#040605', '#131316']}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          <StarRating rating={rating} size={16} />
        </View>
        <Text style={styles.author}>{author}</Text>
      </View>
      <Text style={styles.review}>{review}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#141518',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    gap: 4,
  },
  title: {
    ...fontSemibold,
    fontSize: 15,
    color: COLORS.white,
    letterSpacing: -0.23,
    lineHeight: 20,
  },
  author: {
    ...fontRegular,
    fontSize: 15,
    color: COLORS.gray[500],
    letterSpacing: -0.23,
    lineHeight: 20,
  },
  review: {
    ...fontRegular,
    fontSize: 15,
    color: COLORS.gray[500],
    letterSpacing: -0.23,
    lineHeight: 20,
  },
});
