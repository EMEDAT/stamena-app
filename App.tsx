import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from './src/constants/colors';
import { Badge } from './src/components/Badge';
import { Headline } from './src/components/Headline';
import { Graph } from './src/components/Graph';
import { Source } from './src/components/Source';
import { Button } from './src/components/Button';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <View style={styles.content}>
          <View style={styles.body}>
            <Badge />
            <Headline />
            <Graph />
            <Source />
          </View>
          <Button />
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
    paddingTop: 40,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  body: {
    flexShrink: 0,
  },
});