import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Alert, Linking, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 32;
const PDF_URL = 'https://iris.uniroma1.it/retrieve/handle/11573/1131740/733322/Pastore_Pelvic-muscle_2018.pdf';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Source: React.FC = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const iconScale = useSharedValue(0.8);
  const dialogOpacity = useSharedValue(0);
  const dialogScale = useSharedValue(0.94);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    // Container fade and slide
    opacity.value = withDelay(
      1700,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      1700,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    // Icon pop
    iconScale.value = withDelay(
      1900,
      withSpring(1, {
        damping: 12,
        stiffness: 300,
      })
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: dialogOpacity.value,
  }));

  const dialogCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dialogScale.value }],
    opacity: dialogOpacity.value,
  }));

  const closeDialog = useCallback(() => {
    dialogOpacity.value = withTiming(0, { duration: 180 }, (finished) => {
      'worklet';
      if (finished) {
        runOnJS(setDialogVisible)(false);
      }
    });
    dialogScale.value = withTiming(0.94, { duration: 200 });
  }, [dialogOpacity, dialogScale]);

  const handlePress = useCallback(() => {
    dialogOpacity.value = 0;
    dialogScale.value = 0.94;
    setDialogVisible(true);
    dialogOpacity.value = withTiming(1, { duration: 220 });
    dialogScale.value = withSpring(1, {
      damping: 16,
      stiffness: 220,
    });
  }, [dialogOpacity, dialogScale]);

  const handleDownload = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL(PDF_URL);
      if (!supported) {
        Alert.alert('Download unavailable', 'Unable to open the PDF link on this device.');
        return;
      }
      await Linking.openURL(PDF_URL);
    } catch (error) {
      console.warn('Failed to open PDF link', error);
      Alert.alert('Download failed', 'There was a problem opening the PDF link.');
    } finally {
      closeDialog();
    }
  }, [closeDialog]);

  return (
    <>
      <AnimatedPressable
        style={[styles.container, containerStyle, { width: CARD_WIDTH }]}
        onPress={handlePress}
        android_ripple={{ color: COLORS.gray[800] }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Open source details"
        accessibilityHint="Opens a dialog to download the Sapienza University research PDF"
      >
        <Animated.View style={[styles.iconWrapper, iconStyle]}>
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <G clipPath="url(#diamondClip)">
              <Path
                d="M2.25009 8.5829C2.06338 8.76942 1.91526 8.99091 1.81421 9.2347C1.71315 9.4785 1.66113 9.73982 1.66113 10.0037C1.66113 10.2676 1.71315 10.529 1.81421 10.7728C1.91526 11.0166 2.06338 11.238 2.25009 11.4246L8.57509 17.7496C8.7616 17.9363 8.98309 18.0844 9.22689 18.1854C9.47069 18.2865 9.73201 18.3385 9.99592 18.3385C10.2598 18.3385 10.5212 18.2865 10.765 18.1854C11.0087 18.0844 11.2302 17.9363 11.4168 17.7496L17.7418 11.4246C17.9285 11.238 18.0766 11.0166 18.1776 10.7728C18.2787 10.529 18.3307 10.2676 18.3307 10.0037C18.3307 9.73982 18.2787 9.4785 18.1776 9.2347C18.0766 8.99091 17.9285 8.76942 17.7418 8.5829L11.4168 2.2579C11.2302 2.07119 11.0087 1.92307 10.765 1.82202C10.5212 1.72096 10.2598 1.66895 9.99592 1.66895C9.73201 1.66895 9.47069 1.72096 9.22689 1.82202C8.98309 1.92307 8.7616 2.07119 8.57509 2.2579Z"
                stroke={COLORS.white}
                strokeWidth={1.6667}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </G>
            <Defs>
              <ClipPath id="diamondClip">
                <Rect width={20} height={20} fill="#fff" />
              </ClipPath>
            </Defs>
          </Svg>
        </Animated.View>
        <View>
          <Text style={styles.label}>Source:</Text>
          <Text style={styles.name}>Sapienza University</Text>
        </View>
      </AnimatedPressable>

      <Modal
        transparent
        visible={dialogVisible}
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeDialog}
      >
        <Animated.View style={[styles.dialogBackdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={closeDialog} accessibilityRole="button" />
          <Animated.View style={[styles.dialogCard, dialogCardStyle]}>
            <View style={styles.dialogBadge}>
              <Text style={styles.dialogBadgeText}>PDF</Text>
            </View>
            <Text style={styles.dialogTitle}>Download research PDF</Text>
            <Text style={styles.dialogBody}>
              Open the Sapienza University study in your browser to read or save it for later.
            </Text>
            <View style={styles.dialogActions}>
              <Pressable
                onPress={closeDialog}
                style={({ pressed }) => [
                  styles.dialogButton,
                  styles.dialogButtonSecondary,
                  pressed && styles.dialogButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Dismiss download request"
              >
                <Text style={[styles.dialogButtonText, styles.dialogButtonTextSecondary]}>Not now</Text>
              </Pressable>
              <Pressable
                onPress={handleDownload}
                style={({ pressed }) => [
                  styles.dialogButton,
                  styles.dialogButtonPrimary,
                  pressed && styles.dialogButtonPrimaryPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Download the Sapienza University PDF"
              >
                <Text style={[styles.dialogButtonText, styles.dialogButtonTextPrimary]}>Download</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.gray[900],
    borderWidth: 1,
    borderColor: COLORS.gray[850],
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    alignSelf: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.gray[950],
    borderWidth: 1,
    borderColor: COLORS.gray[850],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    color: COLORS.gray[500],
    lineHeight: 18,
  },
  name: {
    fontSize: 13,
    color: COLORS.white,
    lineHeight: 18,
  },
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 6, 5, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.gray[950],
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.gray[850],
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 32,
    elevation: 26,
  },
  dialogBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.brandRed,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },
  dialogBadgeText: {
    color: '#ffe1e1ff',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffe1e1ff',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  dialogBody: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.gray[500],
    marginBottom: 22,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  dialogButton: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  dialogButtonSecondary: {
    backgroundColor: COLORS.gray[900],
    borderWidth: 1,
    borderColor: COLORS.gray[850],
  },
  dialogButtonPrimary: {
    backgroundColor: COLORS.brandRed,
  },
  dialogButtonPressed: {
    opacity: 0.7,
  },
  dialogButtonPrimaryPressed: {
    opacity: 0.85,
  },
  dialogButtonText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  dialogButtonTextSecondary: {
    color: COLORS.gray[500],
  },
  dialogButtonTextPrimary: {
    color: '#ffe1e1d3',
  },
});