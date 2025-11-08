import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView } from 'react-native';
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
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="light" />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Badge />
          <Headline />
          <Graph />
          <Source />
          <Button />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 40,
  },
});