import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { FretboardConfig } from '../types';

interface FretboardGridProps {
  config: FretboardConfig;
  fretWidth: number;
  stringHeight: number;
  fretboardWidth: number;
  fretboardHeight: number;
}

export const FretboardGrid: React.FC<FretboardGridProps> = ({
  config,
  fretWidth,
  stringHeight,
  fretboardWidth,
  fretboardHeight,
}) => {
  const renderNut = () => {
    if (config.startingFret === 1) {
      return (
        <View
          style={[
            styles.nut,
            {
              height: fretboardHeight,
              backgroundColor: '#000000',
              left: -3,
              width: 15,
            },
          ]}
        />
      );
    }
    return null;
  };

  const renderStrings = () => {
    const strings = [];
    for (let i = 0; i < config.stringCount; i++) {
      strings.push(
        <View
          key={`string-${i}`}
          style={[
            styles.string,
            {
              top: i * stringHeight + stringHeight / 2,
              width: fretboardWidth,
              backgroundColor: '#000000',
              height: 2,
            },
          ]}
        />
      );
    }
    return strings;
  };

  const renderFrets = () => {
    const frets = [];
    for (let i = 1; i <= config.visibleFrets; i++) {
      frets.push(
        <View
          key={`fret-${i}`}
          style={[
            styles.fret,
            {
              left: i * fretWidth,
              height: fretboardHeight,
              backgroundColor: '#000000',
              width: 3,
            },
          ]}
        />
      );
    }
    return frets;
  };

  return (
    <>
      {renderNut()}
      {renderStrings()}
      {renderFrets()}
    </>
  );
};

const styles = StyleSheet.create({
  nut: {
    position: 'absolute',
    zIndex: 2,
  },
  string: {
    position: 'absolute',
    zIndex: 1,
  },
  fret: {
    position: 'absolute',
    zIndex: 1,
  },
});
