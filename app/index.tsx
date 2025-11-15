import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { LAYOUT } from '../src/constants/layout';
import { Badge } from '../src/components/Badge';
import { Headline } from '../src/components/Headline';
import { Graph } from '../src/components/Graph';
import { Source } from '../src/components/Source';
import { BottomToolbar } from '../src/components/BottomToolbar';

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Background gradient: top 80% = #000000, bottom 20% = #2A2F37 */}
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient id="pageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#000000" />
              <Stop offset="70%" stopColor="#000000" />
              <Stop offset="90%" stopColor="#252930ff" />
              <Stop offset="100%" stopColor="#252930ff" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#pageGradient)" />
        </Svg>

        <StatusBar style="light" />
        <View style={styles.content}>
          <View style={styles.body}>
            <Badge />
            <Headline />
            <Graph />
            <Source />
          </View>
          <BottomToolbar
            buttonText="I got it"
            onPress={() => {
              router.push('/onboarding/path1-erectile/education/pelvic-muscle-education');
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: LAYOUT.SCREEN_TOP_PADDING,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  body: {
    flexShrink: 0,
  },
});
