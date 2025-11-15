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

export default function PathToControlEducation() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        {/* Background Image */}
        <ImageBackground
          source={require('../../../../../assets/images/backgrounds/path-1/educational-slide/prototype2.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Title and Description */}
            <View style={styles.textContent}>
              <Text style={styles.title}>
                Path to control
              </Text>
              <Text style={styles.description}>
                Erection quality is trainable. By strengthening the pelvic floor — the key muscle that supports blood flow — you can improve firmness, stay harder longer, and rebuild confidence where it matters most.
              </Text>
            </View>

            {/* Pelvic Bone Illustration Image */}
            <View style={styles.illustrationContainer}>
              <Image
                source={require('../../../../../assets/images/illustrations/path-1/educational-slide/mask-group5.png')}
                style={styles.illustrationImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Bottom Toolbar with Button */}
          <BottomToolbar
            buttonText="Next"
            onPress={() => {
              router.push('/onboarding/path1-erectile/education/welcome-education');
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
  illustrationContainer: {
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
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
});
