import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import {
  FretboardEnhanced,
  type ChordData,
  type FretboardMode,
} from 'react-native-ui-fretboard-component';

export default function App() {
  const [mode, setMode] = useState<FretboardMode>('edit');
  const [chordData, setChordData] = useState<ChordData | null>(null);
  const [savedChord, setSavedChord] = useState<ChordData | null>(null);

  const handleChordChange = (chord: ChordData) => {
    setChordData(chord);
  };

  const handleChordSave = () => {
    if (chordData) {
      setSavedChord(chordData);
      console.log('Chord saved:', chordData);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'edit' ? 'display' : 'edit'));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native Fretboard</Text>
        <Text style={styles.subtitle}>
          Mode: {mode === 'edit' ? 'Edit Mode' : 'Display Mode'}
        </Text>
      </View>

      <View style={styles.fretboardWrapper}>
        <FretboardEnhanced
          mode={mode}
          initialChord={savedChord || undefined}
          showFingerNumbers={true}
          onChordChange={handleChordChange}
          onChordSave={handleChordSave}
          style={styles.fretboard}
        />
      </View>

      <View style={styles.controls}>
        <Button
          title={`Switch to ${mode === 'edit' ? 'Display' : 'Edit'} Mode`}
          onPress={toggleMode}
        />
        {mode === 'edit' && (
          <Button title="Save Chord" onPress={handleChordSave} />
        )}
      </View>

      {chordData && !chordData.metadata.isEmpty && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>Current Chord Data:</Text>
          <Text style={styles.debugText}>
            Positions: {chordData.positions.length}
          </Text>
          <Text style={styles.debugText}>
            Barres: {chordData.barres.length}
          </Text>
          <Text style={styles.debugText}>
            Total Span: {chordData.metadata.totalSpan} frets
          </Text>
          <Text style={styles.debugText}>
            Starting Fret: {chordData.metadata.startingFret}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  fretboardWrapper: {
    marginVertical: 20,
  },
  fretboard: {
    alignSelf: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 20,
  },
  debugInfo: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});
