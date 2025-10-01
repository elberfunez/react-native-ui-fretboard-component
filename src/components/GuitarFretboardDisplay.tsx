import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import type { ChordData } from '../types/ChordData';
import type { ThemePreset } from '../types/Theme';
import type { SizePreset } from '../types/SizePresets';
import { resolveSize } from '../types/SizePresets';
import { useTheme } from '../hooks/useTheme';
import GuitarFretboardRenderer from './GuitarFretboardRenderer';

interface GuitarFretboardDisplayProps {
  chord: ChordData;
  // Legacy size props (still supported)
  width?: number;
  height?: number;
  // New props
  size?: SizePreset;
  theme?: ThemePreset;
  fontFamily?: string;
  showFretMarkers?: boolean;
  showChordName?: boolean;
  showNut?: boolean;
  compact?: boolean;
  numberOfStrings?: number;
  numberOfFrets?: number;
}

const GuitarFretboardDisplay: React.FC<GuitarFretboardDisplayProps> = ({
  chord,
  width: propWidth,
  height: propHeight,
  size,
  theme: themePreset,
  fontFamily,
  showFretMarkers = true,
  showChordName = true,
  showNut = true,
  compact = false,
  numberOfStrings = 6,
  numberOfFrets = 5,
}) => {
  // Resolve theme
  const theme = useTheme(themePreset);

  // Resolve size (prefer size prop, fallback to width/height)
  const { width, height } = useMemo(() => {
    if (size) {
      return resolveSize(size);
    }
    return { width: propWidth || 200, height: propHeight || 250 };
  }, [size, propWidth, propHeight]);

  // Calculate dotRadius dynamically based on width (6% of width)
  // This ensures dots scale proportionally with the fretboard size
  const dotRadius = useMemo(() => Math.round(width * 0.06), [width]);
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

  const chordNameColor = theme.labels.chordNameColor;

  return (
    <View style={styles.container}>
      {showChordName && chord.name && (
        <Text
          style={[
            styles.chordName,
            compact && styles.chordNameCompact,
            { color: chordNameColor },
            fontFamily && { fontFamily },
          ]}
        >
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
        theme={theme}
        fontFamily={fontFamily}
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
