import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedContainer = Animated.View;
const { width: screenWidth } = Dimensions.get('window');

export const Button: React.FC = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(2100, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(
      2100,
      withSpring(0, {
        damping: 20,
        stiffness: 200,
      })
    );
  }, []);

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
      <AnimatedPressable
        style={[styles.button, buttonAnimatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          console.log('Button pressed!');
        }}
      >
        <Animated.View style={[styles.glow, glowAnimatedStyle]} />
        <Text style={styles.text}>Label</Text>
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
    backgroundColor: '#121517',
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
  text: {
    fontSize: 15,
    fontWeight: '400',
    color: '#ffffffab',
    letterSpacing: 0.5,
  },
});