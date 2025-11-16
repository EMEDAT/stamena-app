import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { COLORS } from '../../../../constants/colors';
import { LAYOUT } from '../../../../constants/layout';
import { fontRegular } from '../../../../constants/typography';
import { ArrowRight } from '../../../../components/icons/ArrowRight';
import { BottomToolbar } from '../../../../components/BottomToolbar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PelvicMuscleEducation() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        {/* Background Image */}
        <ImageBackground
          source={require('../../../../../assets/images/onboarding/backgrounds/path-1/educational-slide/prototype.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Title and Description */}
            <View style={styles.textContent}>
              <Text style={styles.title}>
                Modern life is{'\n'}weakening you
              </Text>
              <Text style={styles.description}>
                We weren't made to sit for hours a day.{'\n'}
                But modern life shuts down the pelvic floor, and over time, this critical muscles weakens blood flow, and silently makes it harder to get or stay hard.
              </Text>
            </View>

            {/* Pelvic Anatomy Image */}
            <View style={styles.anatomyContainer}>
              <Image
                source={require('../../../../../assets/images/onboarding/illustrations/path-1/educational-slide/mask-group.png')}
                style={styles.anatomyImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Bottom Toolbar with Button */}
          <BottomToolbar
            buttonText="Next"
            onPress={() => {
              router.push('/onboarding/path1-erectile/education/confidence-education');
            }}
            icon={<ArrowRight size={17} color={COLORS.white} />}
          />
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  contentContainer: {
    flex: 1,
    paddingTop: LAYOUT.SCREEN_TOP_PADDING,
    paddingHorizontal: 16,
  },
  textContent: {
    gap: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  anatomyContainer: {
    position: 'absolute',
    bottom: -100,
    left: 0,
    right: 0,
    height: screenHeight * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'SFProText-Bold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: COLORS.white,
    textAlign: 'center',
  },
  description: {
    ...fontRegular,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.23,
    color: '#A4A7AE',
    textAlign: 'center',
  },
  anatomyImage: {
    width: '100%',
    height: '100%',
  },
});
