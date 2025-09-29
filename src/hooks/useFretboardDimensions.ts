import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import type { FretboardConfig } from '../types';

export const useFretboardDimensions = (config: FretboardConfig) => {
  return useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const fretboardWidth = screenWidth * 0.9;
    const fretWidth = fretboardWidth / config.visibleFrets;
    const stringHeight = 50;
    const fretboardHeight = stringHeight * config.stringCount;

    return {
      screenWidth,
      fretboardWidth,
      fretWidth,
      stringHeight,
      fretboardHeight,
    };
  }, [config.visibleFrets, config.stringCount]);
};
