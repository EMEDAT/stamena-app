import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { COLORS } from '../../../constants/colors';
import { LAYOUT } from '../../../constants/layout';
import { fontRegular } from '../../../constants/typography';
import { BottomToolbar } from '../../../components/BottomToolbar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Goal = 'erectile' | 'ejaculation' | 'wellness';

interface GoalOption {
  id: Goal;
  title: string;
  description: string;
}

const goalOptions: GoalOption[] = [
  {
    id: 'erectile',
    title: 'Improve erectile function',
    description: 'Get hard more easily and stay hard when you want to, without overthinking\u00A0it.',
  },
  {
    id: 'ejaculation',
    title: 'Improve ejaculation control',
    description: 'Last as long as you choose and finish on your own timing, not by accident.',
  },
  {
    id: 'wellness',
    title: 'Maximize sexual wellness',
    description: 'Build full control – stronger erections, better stamina, and confidence that carries into every sexual experience',
  },
];

export default function GoalSelection() {
  const [selectedGoal, setSelectedGoal] = useState<Goal>('erectile');

  const selectGoal = (goalId: Goal) => {
    setSelectedGoal(goalId);
  };

  const handleContinue = () => {
    // Navigate based on selected goal
    if (selectedGoal === 'erectile') {
      router.push('/onboarding/path1-erectile/graph');
    } else if (selectedGoal === 'ejaculation') {
      // TODO: Navigate to path 2 (ejaculation control)
      router.push('/onboarding/path1-erectile/graph'); // Temporary
    } else if (selectedGoal === 'wellness') {
      // TODO: Navigate to path 3 (wellness)
      router.push('/onboarding/path1-erectile/graph'); // Temporary
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <ImageBackground
          source={require('../../../../assets/images/onboarding/backgrounds/general/onboarding-background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>What's your main goal?</Text>
              <Text style={styles.subtitle}>
                Select what you'd like to improve. You can choose multiple options.
              </Text>
            </View>

            {/* Goal Options */}
            <View style={styles.optionsContainer}>
              {goalOptions.map((option) => {
                const isSelected = selectedGoal === option.id;
                return (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => selectGoal(option.id)}
                  >
                    <View style={styles.optionContent}>
                      <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>{option.title}</Text>
                        <Text style={styles.optionDescription}>
                          {option.description}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.radioButton,
                          isSelected && styles.radioButtonSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioButtonInner} />}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Bottom Toolbar */}
          <BottomToolbar buttonText="Continue" onPress={handleContinue} />
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
  progressBarContainer: {
    paddingTop: LAYOUT.SCREEN_TOP_PADDING,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#2A2F37',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    width: '10%',
    height: '100%',
    backgroundColor: '#FF3131',
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 100,
  },
  title: {
    fontFamily: 'SFProText-Bold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.26,
    color: COLORS.white,
    marginBottom: 12,
  },
  subtitle: {
    ...fontRegular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.31,
    color: '#717680',
  },
  optionsContainer: {
    gap: 8,
  },
  optionCard: {
    backgroundColor: '#0A0B0C',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A1D22',
    padding: 17,
    minHeight: 100,
  },
  optionCardSelected: {
    borderColor: '#FF3131',
    backgroundColor: '#2E0D0D',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionText: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.31,
    color: COLORS.white,
  },
  optionDescription: {
    ...fontRegular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.25,
    color: '#717680',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2A2F37',
    backgroundColor: '#0A0B0C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderWidth: 0,
    backgroundColor: '#EE0F0F',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
});