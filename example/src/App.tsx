import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import {
  GuitarFretboardEditor,
  GuitarFretboardDisplay,
} from 'react-native-ui-fretboard-component';
import type { ChordData } from 'react-native-ui-fretboard-component';

export default function App() {
  const [currentChord, setCurrentChord] = useState<ChordData | null>(null);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Guitar Fretboard Component Demo</Text>

        {/* Editor Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive Editor</Text>
          <Text style={styles.instructions}>
            Tap frets to add dots, tap string indicators (X/O), and use controls
            to create chords
          </Text>
          <GuitarFretboardEditor onChordChange={setCurrentChord} />
        </View>

        {/* Display Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Result</Text>
          <Text style={styles.instructions}>
            This shows what the chord will look like when displayed in your app
          </Text>
          {currentChord ? (
            <GuitarFretboardDisplay
              chord={currentChord}
              showChordName={true}
              width={200}
              height={250}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Create a chord above to see it displayed here
              </Text>
            </View>
          )}
        </View>

        {/* Compact Display Example */}
        {currentChord && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compact Mode (for lyrics)</Text>
            <View style={styles.compactRow}>
              <GuitarFretboardDisplay
                chord={currentChord}
                compact={true}
                width={120}
                height={150}
              />
              <GuitarFretboardDisplay
                chord={currentChord}
                compact={true}
                width={120}
                height={150}
              />
            </View>
          </View>
        )}

        {/* JSON Output */}
        {currentChord && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chord Data (JSON)</Text>
            <Text style={styles.instructions}>
              This is what gets saved to your database
            </Text>
            <View style={styles.jsonContainer}>
              <Text style={styles.jsonText}>
                {JSON.stringify(currentChord, null, 2)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  section: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  instructions: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  placeholder: {
    width: 200,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
  },
  placeholderText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
  },
  compactRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  jsonContainer: {
    width: '100%',
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  jsonText: {
    fontFamily: 'Courier',
    fontSize: 11,
    color: '#a9dc76',
    lineHeight: 16,
  },
});
