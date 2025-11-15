import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable, Dimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';
import { fontMedium } from '../constants/typography';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedContainer = Animated.View;
const { width: screenWidth } = Dimensions.get('window');

interface BottomToolbarProps {
  buttonText: string;
  onPress: () => void;
  icon?: React.ReactNode;
  enableAnimation?: boolean;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  buttonText,
  onPress,
  icon,
  enableAnimation = false,
}) => {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowOpacity.value, [0, 1], [0.3, 0.6]),
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 100 });
    glowOpacity.value = withTiming(1, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    glowOpacity.value = withTiming(0, { duration: 200 });
  };

  return (
    <AnimatedContainer style={[styles.container, containerAnimatedStyle, { width: screenWidth }]}>
      <View style={styles.gradientOverlay} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <SvgLinearGradient id="footerGradient" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#040605" />
              <Stop offset="100%" stopColor="#0c0d10ff" />
            </SvgLinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#footerGradient)" />
        </Svg>
      </View>
      <AnimatedPressable
        style={[styles.button, buttonAnimatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.glow, glowAnimatedStyle]} />
        <View style={styles.buttonContent}>
          <Text style={styles.text}>{buttonText}</Text>
          {icon}
        </View>
      </AnimatedPressable>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 0,
    marginHorizontal: -6,
    paddingTop: 13,
    paddingBottom: 50,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 16,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.brandRed,
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: COLORS.brandRed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    position: 'relative',
    overflow: 'visible',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.brandRed,
    borderRadius: 16,
    opacity: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    ...fontMedium,
    fontSize: 15,
    color: '#ffffffff',
    letterSpacing: 0.5,
  },
});
