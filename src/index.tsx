import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const NUM_STRINGS = 6;
const NUM_FRETS = 5;

const GuitarChordDiagram: React.FC = () => {
  const handleFretPress = (stringIndex: number, fretIndex: number) => {
    console.log(
      `Fret pressed at string ${stringIndex + 1}, fret ${fretIndex + 1}`
    );
    // Here you would implement the logic to add a dot
  };

  const renderFrets = () => {
    const strings = [];
    for (let i = 0; i < NUM_STRINGS; i++) {
      const frets = [];
      for (let j = 0; j < NUM_FRETS; j++) {
        frets.push(
          <TouchableOpacity
            key={j}
            style={styles.fret}
            onPress={() => handleFretPress(i, j)}
          />
        );
      }
      strings.push(
        <View key={i} style={styles.string}>
          {frets}
        </View>
      );
    }
    return strings;
  };

  return (
    <View style={styles.diagramContainer}>
      <View style={styles.nut} />
      {renderFrets()}
    </View>
  );
};

const styles = StyleSheet.create({
  diagramContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#e0e0e0ff',
    borderRadius: 5,
    padding: 10,
  },
  nut: {
    width: 10,
    backgroundColor: '#000',
    marginRight: 5,
  },
  string: {
    flexDirection: 'column-reverse',
  },
  fret: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default GuitarChordDiagram;
