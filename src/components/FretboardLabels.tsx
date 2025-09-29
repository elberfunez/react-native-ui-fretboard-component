import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { FretboardConfig, FretboardTheme } from '../types';

interface FretboardLabelsProps {
  config: FretboardConfig;
  fretWidth: number;
  stringHeight: number;
  theme: FretboardTheme;
}

export const FretboardLabels: React.FC<FretboardLabelsProps> = ({
  config,
  fretWidth,
  theme,
}) => {
  const renderFretNumbers = () => {
    const fretNumbers = [];
    for (let i = 1; i <= config.visibleFrets; i++) {
      const fretNum = config.startingFret + i - 1;
      fretNumbers.push(
        <View
          key={`fret-num-${i}`}
          style={[
            styles.fretNumber,
            {
              width: fretWidth,
              left: (i - 1) * fretWidth,
            },
          ]}
        >
          <Text
            style={[styles.fretNumberText, { color: theme.labelTextColor }]}
          >
            {fretNum}
          </Text>
        </View>
      );
    }
    return fretNumbers;
  };

  return (
    <>
      <View style={styles.fretNumbersContainer}>{renderFretNumbers()}</View>
    </>
  );
};

const styles = StyleSheet.create({
  fretNumbersContainer: {
    position: 'relative',
    height: 25,
  },
  fretNumber: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fretNumberText: {
    fontSize: 12,
    fontWeight: '500',
  },
  stringName: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stringNameText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
