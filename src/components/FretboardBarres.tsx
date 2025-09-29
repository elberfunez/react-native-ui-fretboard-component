import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Barre } from '../types';

interface FretboardBarresProps {
  barres: Barre[];
  fretWidth: number;
  stringHeight: number;
  showFingerNumbers: boolean;
  mode: 'display' | 'edit';
  onBarrePress: (barreId: string) => void;
}

export const FretboardBarres: React.FC<FretboardBarresProps> = ({
  barres,
  fretWidth,
  stringHeight,
  showFingerNumbers,
  mode,
  onBarrePress,
}) => {
  return (
    <>
      {barres.map((barre) => {
        const barreHeight =
          (Math.abs(barre.toString - barre.fromString) + 1) * stringHeight - 12;
        const barreTop =
          Math.min(barre.fromString, barre.toString) * stringHeight + 6;

        return (
          <TouchableOpacity
            key={barre.id}
            style={[
              styles.barre,
              {
                left: (barre.fret - 0.5) * fretWidth - 15,
                top: barreTop,
                width: 30,
                height: barreHeight,
                backgroundColor: '#000000',
              },
            ]}
            onPress={() => onBarrePress(barre.id)}
            activeOpacity={0.6}
            disabled={mode === 'display'}
          >
            {showFingerNumbers && barre.finger && (
              <Text style={[styles.barreFingerNumber, { color: '#FFFFFF' }]}>
                {barre.finger}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  barre: {
    position: 'absolute',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  barreFingerNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
