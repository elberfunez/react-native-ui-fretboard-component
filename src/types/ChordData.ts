export interface ChordData {
  dots: Array<{ string: number; fret: number; finger?: number }>;
  barres: Array<{
    fret: number;
    startString: number;
    endString: number;
    finger?: number;
  }>;
  stringStates: Array<'X' | 'O'>;
  startingFret?: number;
  name?: string;
}
