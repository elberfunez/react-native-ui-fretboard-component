import { View, StyleSheet } from 'react-native';
import GuitarChordDiagram from 'react-native-ui-fretboard-component';

export default function App() {
  return (
    <View style={styles.container}>
      <GuitarChordDiagram />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
