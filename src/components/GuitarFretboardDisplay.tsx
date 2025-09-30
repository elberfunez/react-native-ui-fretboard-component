import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import type { ChordData } from '../types/ChordData';
import GuitarFretboardRenderer from './GuitarFretboardRenderer';

interface GuitarFretboardDisplayProps {
  chord: ChordData;
  width?: number;
  height?: number;
  showFretMarkers?: boolean;
  showChordName?: boolean;
  showNut?: boolean;
  compact?: boolean;
  numberOfStrings?: number;
  numberOfFrets?: number;
}

const GuitarFretboardDisplay: React.FC<GuitarFretboardDisplayProps> = ({
  chord,
  width = 200,
  height = 250,
  showFretMarkers = true,
  showChordName = true,
  showNut = true,
  compact = false,
  numberOfStrings = 6,
  numberOfFrets = 5,
}) => {
  const dotRadius = compact ? 10 : 12;
  const startingFret = chord.startingFret ?? 1;

  // Convert chord data to the format expected by renderer
  const fingerNumbers = useMemo(() => {
    const map = new Map<string, number>();

    // Add dot finger numbers
    chord.dots.forEach((dot) => {
      if (dot.finger) {
        const key = `${dot.string}-${dot.fret}`;
        map.set(key, dot.finger);
      }
    });

    // Add barre finger numbers
    chord.barres.forEach((barre) => {
      if (barre.finger) {
        const key = `barre-${barre.fret}-${barre.startString}-${barre.endString}`;
        map.set(key, barre.finger);
      }
    });

    return map;
  }, [chord]);

  return (
    <View style={styles.container}>
      {showChordName && chord.name && (
        <Text style={[styles.chordName, compact && styles.chordNameCompact]}>
          {chord.name}
        </Text>
      )}
      <GuitarFretboardRenderer
        dots={chord.dots}
        barres={chord.barres}
        fingerNumbers={fingerNumbers}
        stringStates={chord.stringStates}
        startingFret={startingFret}
        numberOfStrings={numberOfStrings}
        numberOfFrets={numberOfFrets}
        gridWidth={width}
        gridHeight={height}
        dotRadius={dotRadius}
        showNut={showNut}
        showFretMarkers={showFretMarkers}
        isEditable={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chordName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  chordNameCompact: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default GuitarFretboardDisplay;
