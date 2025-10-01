export interface FretboardColors {
  stringColor: string;
  fretColor: string;
  nutColor: string;
  backgroundColor: string;
}

export interface StringIndicatorColors {
  mutedColor: string; // X
  openColor: string; // O
  strokeColor: string;
}

export interface LabelColors {
  chordNameColor: string;
  fretNumberColor: string;
  stringNumberColor: string;
  fretLabelColor: string;
}

export interface DotColors {
  fillColor: string;
  textColor: string;
  barreColor: string;
  barreTextColor: string;
  barreInProgressColor: string;
}

export interface MarkerColors {
  fillColor: string;
  opacity: number;
}

export interface FretboardTheme {
  fretboard: FretboardColors;
  stringIndicators: StringIndicatorColors;
  labels: LabelColors;
  dots: DotColors;
  markers: MarkerColors;
}

// Light theme (default)
export const lightTheme: FretboardTheme = {
  fretboard: {
    stringColor: '#000000',
    fretColor: '#000000',
    nutColor: '#000000',
    backgroundColor: 'transparent',
  },
  stringIndicators: {
    mutedColor: '#000000',
    openColor: '#000000',
    strokeColor: '#000000',
  },
  labels: {
    chordNameColor: '#333333',
    fretNumberColor: '#333333',
    stringNumberColor: '#000000',
    fretLabelColor: '#333333',
  },
  dots: {
    fillColor: '#000000',
    textColor: '#ffffff',
    barreColor: '#000000',
    barreTextColor: '#ffffff',
    barreInProgressColor: '#007AFF',
  },
  markers: {
    fillColor: '#d0d0d0',
    opacity: 0.5,
  },
};

// Dark theme
export const darkTheme: FretboardTheme = {
  fretboard: {
    stringColor: '#e0e0e0',
    fretColor: '#e0e0e0',
    nutColor: '#ffffff',
    backgroundColor: '#1a1a1a',
  },
  stringIndicators: {
    mutedColor: '#ffffff',
    openColor: '#ffffff',
    strokeColor: '#e0e0e0',
  },
  labels: {
    chordNameColor: '#ffffff',
    fretNumberColor: '#ffffff',
    stringNumberColor: '#ffffff',
    fretLabelColor: '#ffffff',
  },
  dots: {
    fillColor: '#ffffff',
    textColor: '#000000',
    barreColor: '#ffffff',
    barreTextColor: '#000000',
    barreInProgressColor: '#4A9EFF',
  },
  markers: {
    fillColor: '#555555',
    opacity: 0.5,
  },
};

export type ThemePreset = 'light' | 'dark' | 'auto' | FretboardTheme;
