export { FretboardEnhanced } from './FretboardEnhanced';
export type {
  FretboardProps,
  FretboardMode,
  EditMode,
  FingerNumber,
  FretboardConfig,
  FingerPosition,
  Barre,
  ChordData,
  ValidationWarning,
  ValidationResult,
  FretboardTheme,
} from './types';

import React, { useState, type JSX } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';

const NUM_STRINGS = 6;
const NUM_FRETS = 5;

type FretboardState = boolean[][];

const initialFretboardState: FretboardState = Array(NUM_STRINGS)
  .fill(false)
  .map(() => Array(NUM_FRETS).fill(false));

const GuitarChordDiagram: React.FC = () => {
  const [frettedNotes, setFrettedNotes] = useState<FretboardState>(
    initialFretboardState
  );

  const handleFretPress = (stringIndex: number, fretIndex: number): void => {
    const newFrettedNotes: FretboardState = frettedNotes.map((stringRow) => [
      ...stringRow,
    ]);
    if (
      newFrettedNotes[stringIndex] &&
      typeof newFrettedNotes[stringIndex][fretIndex] !== 'undefined'
    ) {
      newFrettedNotes[stringIndex][fretIndex] =
        !newFrettedNotes[stringIndex][fretIndex];
      setFrettedNotes(newFrettedNotes);
    }
  };

  const renderFrets = (): JSX.Element[] => {
    const strings: JSX.Element[] = [];
    for (let i = 0; i < NUM_STRINGS; i++) {
      const frets: JSX.Element[] = [];
      for (let j = 0; j < NUM_FRETS; j++) {
        const isFretted: boolean | undefined = frettedNotes[i]?.[j];

        frets.push(
          <TouchableOpacity
            key={`${i}-${j}`}
            style={styles.fret}
            onPress={() => handleFretPress(i, j)}
            activeOpacity={0.6}
          >
            {isFretted && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      }
      strings.push(
        <View key={`string-${i}`} style={styles.string}>
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
    padding: 8,
    backgroundColor: '#edededff',
    borderColor: '#94a3b8',
    borderWidth: 2,
    borderRadius: 12,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#cbd5e1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
        shadowColor: '#cbd5e1',
      },
    }),
  },
  nut: {
    width: 8,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginRight: 4,
  },
  string: {
    flexDirection: 'column-reverse',
  },
  fret: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#8c8d8dff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 36,
    height: 36,
    backgroundColor: '#2b2c2bff',
    borderRadius: 18,
  },
});

export default GuitarChordDiagram;
