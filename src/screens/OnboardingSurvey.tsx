import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';
import { fontSemibold, fontRegular, fontMedium } from '../constants/typography';
import { ReviewCard } from '../components/ReviewCard';
import { UserIcon } from '../components/icons/UserIcon';
import { PersonIcon } from '../components/icons/PersonIcon';

const { width: screenWidth } = Dimensions.get('window');

export const OnboardingSurvey: React.FC = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const badgeY = useRef(new Animated.Value(-20)).current;
  const headlineOpacity = useRef(new Animated.Value(0)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const reviewsOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Staggered animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(badgeY, { toValue: 0, useNativeDriver: true }),
      ]),
      Animated.timing(headlineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(statsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(reviewsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(progressWidth, { toValue: 1, duration: 1200, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(buttonY, { toValue: 0, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const progressWidthInterpolated = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge */}
        <Animated.View
          style={[
            styles.badgeContainer,
            { opacity: fadeAnim, transform: [{ translateY: badgeY }] },
          ]}
        >
          <View style={styles.badge}>
            <UserIcon size={17} color="#FFFFFF" />
            <Text style={styles.badgeText}>USER SURVEY</Text>
          </View>
        </Animated.View>

        {/* Headline */}
        <Animated.View style={{ opacity: headlineOpacity }}>
          <Text style={styles.headline}>
            <Text style={styles.highlightGreen}>8 out of 10</Text>
            <Text style={styles.headlineWhite}>
              {' men improved their ejaculation control by following the Kegel Plan'}
            </Text>
          </Text>
        </Animated.View>

        {/* Stats Visualization */}
        <Animated.View style={[styles.statsCard, { opacity: statsOpacity }]}>
          <View style={styles.personIcons}>
            {Array.from({ length: 10 }, (_, index) => (
              <PersonIcon
                key={index}
                size={24}
                color={index < 8 ? COLORS.brandGreen : COLORS.gray[700]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Customer Reviews Section */}
        <Animated.View style={[styles.reviewsSection, { opacity: reviewsOpacity }]}>
          <Text style={styles.reviewsTitle}>Customer reviews</Text>

          <View style={styles.reviewsList}>
            <ReviewCard
              title="Good exercises"
              author="John D."
              review="2 weeks and I can already feel some improvements!"
              rating={5}
            />
            <ReviewCard
              title="Awesome!"
              author="John D."
              review="2 weeks and I can already feel improvements!"
              rating={5}
            />
          </View>
        </Animated.View>

        {/* Loading Progress */}
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Connecting to the database</Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidthInterpolated,
                },
              ]}
            >
              <Text style={styles.progressText}>100%</Text>
            </Animated.View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Toolbar with Button */}
      <Animated.View
        style={[
          styles.bottomToolbar,
          { opacity: buttonOpacity, transform: [{ translateY: buttonY }] },
        ]}
      >
        <LinearGradient
          colors={['#040605', '#0c0f12']}
          style={styles.gradientOverlay}
        />
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log('I got it pressed');
          }}
        >
          <Text style={styles.buttonText}>I got it</Text>
        </Pressable>
        {/* Home Indicator */}
        <View style={styles.homeIndicator} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 140,
    gap: 20,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F79009',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#F79009',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    ...fontSemibold,
    fontSize: 15,
    color: COLORS.white,
    letterSpacing: -0.23,
    lineHeight: 20,
  },
  headline: {
    ...fontSemibold,
    fontSize: 17,
    textAlign: 'center',
    letterSpacing: -0.43,
    lineHeight: 24,
  },
  highlightGreen: {
    color: '#12B76A',
  },
  headlineWhite: {
    color: COLORS.white,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#141518',
    backgroundColor: '#040605',
    marginTop: 4,
  },
  personIcons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewsSection: {
    gap: 16,
  },
  reviewsTitle: {
    ...fontSemibold,
    fontSize: 15,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -0.23,
    lineHeight: 20,
  },
  reviewsList: {
    gap: 8,
  },
  loadingCard: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#141518',
    backgroundColor: '#040605',
    marginTop: 8,
  },
  loadingText: {
    ...fontRegular,
    fontSize: 15,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -0.23,
    lineHeight: 20,
  },
  progressBar: {
    height: 28,
    backgroundColor: '#570505',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.brandRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    ...fontSemibold,
    fontSize: 13,
    color: COLORS.white,
    letterSpacing: -0.08,
    lineHeight: 18,
  },
  bottomToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    backgroundColor: COLORS.brandRed,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.brandRed,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    ...fontRegular,
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: -0.31,
    lineHeight: 24,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 8,
  },
});
