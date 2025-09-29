import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { FingerPosition, Barre, FretboardConfig } from '../types';

interface FretboardPositionsProps {
  config: FretboardConfig;
  positions: FingerPosition[];
  barres: Barre[];
  barreStartPosition: { fret: number; string: number } | null;
  fretWidth: number;
  stringHeight: number;
  showFingerNumbers: boolean;
  mode: 'display' | 'edit';
  isPositionActive: (string: number, fret: number) => boolean;
  onPositionPress: (string: number, fret: number) => void;
}

export const FretboardPositions: React.FC<FretboardPositionsProps> = ({
  config,
  positions,
  barres,
  barreStartPosition,
  fretWidth,
  stringHeight,
  showFingerNumbers,
  mode,
  isPositionActive,
  onPositionPress,
}) => {
  const positionElements = [];

  for (let string = 0; string < config.stringCount; string++) {
    for (let fret = 1; fret <= config.visibleFrets; fret++) {
      const isActive = isPositionActive(string, fret);
      const position = positions.find(
        (p) => p.string === string && p.fret === fret
      );

      const coveredByBarre = barres.some(
        (b) => b.fret === fret && string >= b.fromString && string <= b.toString
      );

      const isBarreStart =
        barreStartPosition &&
        barreStartPosition.fret === fret &&
        barreStartPosition.string === string;

      const isValidBarreEnd =
        barreStartPosition &&
        barreStartPosition.fret === fret &&
        barreStartPosition.string !== string;

      positionElements.push(
        <TouchableOpacity
          key={`pos-${string}-${fret}`}
          style={[
            styles.positionArea,
            {
              left: (fret - 1) * fretWidth,
              top: string * stringHeight,
              width: fretWidth,
              height: stringHeight,
              backgroundColor: isBarreStart
                ? 'rgba(59, 130, 246, 0.3)'
                : isValidBarreEnd
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'transparent',
            },
          ]}
          onPress={() => onPositionPress(string, fret)}
          activeOpacity={0.6}
          disabled={mode === 'display'}
        >
          {isActive && !coveredByBarre && (
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: '#000000',
                },
              ]}
            >
              {showFingerNumbers && position?.finger && (
                <Text style={[styles.fingerNumber, { color: '#FFFFFF' }]}>
                  {position.finger}
                </Text>
              )}
            </View>
          )}
          {isBarreStart && (
            <View style={styles.barreStartIndicator}>
              <Text style={styles.barreStartText}>START</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
  }

  return <>{positionElements}</>;
};

const styles = StyleSheet.create({
  positionArea: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  fingerNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  barreStartIndicator: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  barreStartText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
});
