import type { ViewStyle } from 'react-native';

export type EditMode = 'dots' | 'barres' | 'fingers';
export type FretboardMode = 'edit' | 'display';
export type FingerNumber = 1 | 2 | 3 | 4;

export interface FretboardConfig {
  stringCount: number;
  visibleFrets: number;
  startingFret: number;
}

export interface FingerPosition {
  string: number;
  fret: number;
  finger?: FingerNumber;
  barreId?: string;
}

export interface Barre {
  id: string;
  fret: number;
  fromString: number;
  toString: number;
  finger?: FingerNumber;
}

export interface ChordData {
  positions: FingerPosition[];
  barres: Barre[];
  detectedChordName?: string;
  metadata: {
    startingFret: number;
    visibleFrets: number;
    hasFingerNumbers: boolean;
    isEmpty: boolean;
    totalSpan: number;
  };
}

export interface ValidationWarning {
  type: 'overlap' | 'impossible_stretch' | 'invalid_position';
  message: string;
  affectedPositions?: FingerPosition[];
  affectedBarres?: Barre[];
}

export interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
}

export interface FretboardTheme {
  backgroundColor: string;
  fretboardColor: string;
  stringColor: string;
  fretColor: string;
  nutColor: string;
  dotColor: string;
  dotActiveColor: string;
  barreColor: string;
  fingerNumberColor: string;
  fingerNumberBackgroundColor: string;
  labelTextColor: string;
  warningColor: string;
}

export interface FretboardProps {
  mode?: FretboardMode;
  initialChord?: ChordData;
  editMode?: EditMode;
  showFingerNumbers?: boolean;

  onChordChange?: (chord: ChordData) => void;
  onChordSave?: (chord: ChordData) => void;
  onValidationChange?: (result: ValidationResult) => void;
  onEditModeChange?: (mode: EditMode) => void;

  config?: Partial<FretboardConfig>;
  style?: ViewStyle;
  theme?: Partial<FretboardTheme>;
}
