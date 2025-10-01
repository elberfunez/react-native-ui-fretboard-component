import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import type { FingerPosition } from '../types/FingerPosition';
import type { Barre } from '../types/Barre';
import type { ChordData } from '../types/ChordData';
import type { ThemePreset } from '../types/Theme';
import type { SizePreset } from '../types/SizePresets';
import { resolveSize } from '../types/SizePresets';
import { useTheme } from '../hooks/useTheme';
import GuitarFretboardRenderer from './GuitarFretboardRenderer';
import GuitarGridEditorControls from './GuitarGridEditorControls';
import ChordLabel from './ChordLabel';
import { useChordDetection } from '../hooks/useChordDetection';

interface GuitarFretboardEditorProps {
  // Visual props (legacy - still supported)
  numberOfStrings?: number;
  numberOfFrets?: number;
  gridWidth?: number;
  gridHeight?: number;
  showNut?: boolean;
  dotRadius?: number;
  showFretMarkers?: boolean;

  // New theme & sizing props
  theme?: ThemePreset;
  size?: SizePreset;
  fontFamily?: string;

  // UI control props
  showControls?: boolean;
  showChordDetection?: boolean;

  // Data flow props
  initialChord?: ChordData;
  onChordChange?: (chord: ChordData) => void;
  defaultStartingFret?: number;
}

const DEFAULT_CONFIG = {
  numberOfStrings: 6,
  numberOfFrets: 5,
  gridWidth: 200,
  gridHeight: 250,
  showNut: true,
  showFretMarkers: true,
  defaultStartingFret: 1,
  showControls: true,
  showChordDetection: true,
};

const GuitarFretboardEditor: React.FC<GuitarFretboardEditorProps> = (props) => {
  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...props }), [props]);

  const {
    numberOfStrings,
    numberOfFrets,
    gridWidth: propGridWidth,
    gridHeight: propGridHeight,
    showNut,
    dotRadius,
    showFretMarkers,
    defaultStartingFret,
    initialChord,
    onChordChange,
    theme: themePreset,
    size,
    fontFamily,
    showControls,
    showChordDetection,
  } = config;

  // Resolve theme
  const theme = useTheme(themePreset);

  // Resolve size (prefer size prop, fallback to width/height)
  const { width: gridWidth, height: gridHeight } = useMemo(() => {
    if (size) {
      return resolveSize(size);
    }
    return { width: propGridWidth!, height: propGridHeight! };
  }, [size, propGridWidth, propGridHeight]);

  // Calculate dotRadius dynamically based on gridWidth (6% of width)
  // This ensures dots scale proportionally with the fretboard size
  const calculatedDotRadius = useMemo(
    () => dotRadius || Math.round(gridWidth * 0.06),
    [gridWidth, dotRadius]
  );

  // Initialize state from initialChord if provided
  const [selectedDots, setSelectedDots] = useState<FingerPosition[]>(
    initialChord?.dots || []
  );
  const [fingerNumbers, setFingerNumbers] = useState<Map<string, number>>(
    () => {
      const map = new Map<string, number>();
      if (initialChord) {
        initialChord.dots.forEach((dot) => {
          if (dot.finger) {
            const key = `${dot.string}-${dot.fret}`;
            map.set(key, dot.finger);
          }
        });
        initialChord.barres.forEach((barre) => {
          if (barre.finger) {
            const key = `barre-${barre.fret}-${barre.startString}-${barre.endString}`;
            map.set(key, barre.finger);
          }
        });
      }
      return map;
    }
  );
  const [stringStates, setStringStates] = useState<Array<'X' | 'O'>>(
    initialChord?.stringStates || Array(numberOfStrings).fill('O')
  );
  const [barres, setBarres] = useState<Barre[]>(initialChord?.barres || []);
  const [barreInProgress, setBarreInProgress] = useState<{
    fret: number;
    startString: number;
  } | null>(null);
  const [startingFret, setStartingFret] = useState(
    initialChord?.startingFret || defaultStartingFret
  );
  const [editMode, setEditMode] = useState<'dots' | 'barres'>('dots');

  // Emit chord changes
  useEffect(() => {
    if (onChordChange) {
      const chordData: ChordData = {
        dots: selectedDots.map((dot) => {
          const key = `${dot.string}-${dot.fret}`;
          const finger = fingerNumbers.get(key);
          return { ...dot, finger };
        }),
        barres: barres.map((barre) => {
          const key = `barre-${barre.fret}-${barre.startString}-${barre.endString}`;
          const finger = fingerNumbers.get(key);
          return { ...barre, finger };
        }),
        stringStates,
        startingFret,
      };
      onChordChange(chordData);
    }
  }, [
    selectedDots,
    barres,
    fingerNumbers,
    stringStates,
    startingFret,
    onChordChange,
  ]);

  const getDotKey = (dot: FingerPosition) => `${dot.string}-${dot.fret}`;

  const getBarreKey = (barre: Barre) =>
    `barre-${barre.fret}-${barre.startString}-${barre.endString}`;

  const isSelected = (dot: FingerPosition) =>
    selectedDots.some((d) => d.string === dot.string && d.fret === dot.fret);

  const handleDotPress = (dot: FingerPosition) => {
    // Check if this dot is part of a barre
    const barreThatIncludesDot = barres.find(
      (b) =>
        b.fret === dot.fret &&
        dot.string >= b.startString &&
        dot.string <= b.endString
    );

    if (barreThatIncludesDot) {
      // This dot is part of a barre - cycle the barre number
      const barreKey = getBarreKey(barreThatIncludesDot);
      setFingerNumbers((prev) => {
        const newMap = new Map(prev);
        const currentAssignedFingerNum = newMap.get(barreKey) || 0;
        if (currentAssignedFingerNum >= 4) {
          // Remove barre
          newMap.delete(barreKey);
          setBarres((prevBarres) =>
            prevBarres.filter((b) => getBarreKey(b) !== barreKey)
          );
          // Remove dots from barre
          setSelectedDots((prevDots) =>
            prevDots.filter(
              (d) =>
                !(
                  d.fret === barreThatIncludesDot.fret &&
                  d.string >= barreThatIncludesDot.startString &&
                  d.string <= barreThatIncludesDot.endString
                )
            )
          );
        } else {
          newMap.set(barreKey, currentAssignedFingerNum + 1);
        }
        return newMap;
      });
    } else if (editMode === 'barres') {
      // Barre mode: select start and end string on same fret
      if (!barreInProgress) {
        setBarreInProgress({ fret: dot.fret, startString: dot.string });
      } else if (barreInProgress.fret === dot.fret) {
        // Second click on same fret: complete the barre
        const startString = Math.min(barreInProgress.startString, dot.string);
        const endString = Math.max(barreInProgress.startString, dot.string);

        const newBarre: Barre = {
          fret: dot.fret,
          startString,
          endString,
        };

        setBarres((prev) => [...prev, newBarre]);

        // Add all dots in the barre to selectedDots
        const barreDots: FingerPosition[] = [];
        for (let s = startString; s <= endString; s++) {
          barreDots.push({ string: s, fret: dot.fret });
        }
        setSelectedDots((prev) => {
          const filtered = prev.filter(
            (d) =>
              !(
                d.fret === dot.fret &&
                d.string >= startString &&
                d.string <= endString
              )
          );
          return [...filtered, ...barreDots];
        });

        // Assign finger number 1 by default to new barre
        const barreKey = getBarreKey(newBarre);
        setFingerNumbers((prev) => {
          const newMap = new Map(prev);
          newMap.set(barreKey, 1);
          return newMap;
        });

        setBarreInProgress(null);
      } else {
        // Clicked on different fret: reset and start new barre
        setBarreInProgress({ fret: dot.fret, startString: dot.string });
      }
    } else {
      // Normal mode: cycle finger numbers 1-4, then remove dot
      const key = getDotKey(dot);
      const exists = isSelected(dot);

      if (exists) {
        // Dot exists - cycle finger number
        setFingerNumbers((prev) => {
          const newMap = new Map(prev);
          const current = newMap.get(key) || 0;
          if (current >= 4) {
            // Remove dot and finger number
            newMap.delete(key);
            setSelectedDots((prevDots) =>
              prevDots.filter(
                (d) => !(d.string === dot.string && d.fret === dot.fret)
              )
            );
          } else {
            newMap.set(key, current + 1);
          }
          return newMap;
        });
      } else {
        // New dot - add it with finger number 1
        setSelectedDots((prev) => [...prev, dot]);
        setFingerNumbers((prev) => {
          const newMap = new Map(prev);
          newMap.set(key, 1);
          return newMap;
        });
      }
    }
  };

  const toggleStringState = (index: number) => {
    setStringStates((prev) => {
      const newStates = [...prev];
      if (prev[index] === 'O') {
        newStates[index] = 'X';
      } else {
        newStates[index] = 'O';
      }
      return newStates;
    });
  };

  const handleEditModeChange = (mode: 'dots' | 'barres') => {
    setEditMode(mode);
    setBarreInProgress(null); // Reset barre progress when switching modes
  };

  const handleClearPress = () => {
    setSelectedDots([]);
    setFingerNumbers(new Map());
    setBarres([]);
    setBarreInProgress(null);
    setStringStates(Array(numberOfStrings).fill('O'));
  };

  const handleResetPress = () => {
    setSelectedDots([]);
    setFingerNumbers(new Map());
    setBarres([]);
    setBarreInProgress(null);
    setStringStates(Array(numberOfStrings).fill('O'));
    setStartingFret(1);
  };

  const handleShiftUp = () => {
    const maxFret = Math.max(
      ...selectedDots.map((d) => d.fret),
      ...barres.map((b) => b.fret)
    );

    if (maxFret < 24) {
      const newMaxFret = maxFret + 1;

      setSelectedDots((prev) =>
        prev.map((dot) => ({ ...dot, fret: dot.fret + 1 }))
      );
      setBarres((prev) =>
        prev.map((barre) => ({ ...barre, fret: barre.fret + 1 }))
      );
      setFingerNumbers((prev) => {
        const newMap = new Map();
        prev.forEach((value, key) => {
          if (key.startsWith('barre-')) {
            const parts = key.split('-');
            const fret = parts[1];
            const startString = parts[2];
            const endString = parts[3];
            if (fret && startString && endString) {
              const newKey = `barre-${parseInt(fret, 10) + 1}-${startString}-${endString}`;
              newMap.set(newKey, value);
            }
          } else {
            const parts = key.split('-');
            const string = parts[0];
            const fret = parts[1];
            if (string && fret) {
              const newKey = `${string}-${parseInt(fret, 10) + 1}`;
              newMap.set(newKey, value);
            }
          }
        });
        return newMap;
      });

      // Auto-adjust startingFret if chord goes out of view
      const viewEndFret = startingFret + numberOfFrets - 1;
      if (newMaxFret > viewEndFret) {
        const newStartingFret = Math.min(newMaxFret - numberOfFrets + 2, 20);
        setStartingFret(Math.max(1, newStartingFret));
      }
    }
  };

  const handleShiftDown = () => {
    const minFret = Math.min(
      ...selectedDots.map((d) => d.fret),
      ...barres.map((b) => b.fret)
    );

    if (minFret > 1) {
      const newMinFret = minFret - 1;

      setSelectedDots((prev) =>
        prev.map((dot) => ({ ...dot, fret: dot.fret - 1 }))
      );
      setBarres((prev) =>
        prev.map((barre) => ({ ...barre, fret: barre.fret - 1 }))
      );
      setFingerNumbers((prev) => {
        const newMap = new Map();
        prev.forEach((value, key) => {
          if (key.startsWith('barre-')) {
            const parts = key.split('-');
            const fret = parts[1];
            const startString = parts[2];
            const endString = parts[3];
            if (fret && startString && endString) {
              const newKey = `barre-${parseInt(fret, 10) - 1}-${startString}-${endString}`;
              newMap.set(newKey, value);
            }
          } else {
            const parts = key.split('-');
            const string = parts[0];
            const fret = parts[1];
            if (string && fret) {
              const newKey = `${string}-${parseInt(fret, 10) - 1}`;
              newMap.set(newKey, value);
            }
          }
        });
        return newMap;
      });

      // Auto-adjust startingFret if chord goes out of view
      if (newMinFret < startingFret) {
        const newStartingFret = newMinFret - 1;
        setStartingFret(Math.max(1, newStartingFret));
      }
    }
  };

  const { notes, primaryChord } = useChordDetection(
    selectedDots,
    stringStates,
    barres
  );

  return (
    <View style={styles.container}>
      {showChordDetection && (
        <ChordLabel
          chordName={primaryChord}
          notes={notes}
          theme={theme}
          fontFamily={fontFamily}
        />
      )}
      {showControls && (
        <GuitarGridEditorControls
          editMode={editMode}
          onEditModeChange={handleEditModeChange}
          onClear={handleClearPress}
          startingFret={startingFret}
          onStartingFretChange={setStartingFret}
          onReset={handleResetPress}
          onShiftUp={handleShiftUp}
          onShiftDown={handleShiftDown}
          fontFamily={fontFamily}
        />
      )}
      <GuitarFretboardRenderer
        dots={selectedDots}
        barres={barres}
        fingerNumbers={fingerNumbers}
        stringStates={stringStates}
        startingFret={startingFret}
        numberOfStrings={numberOfStrings}
        numberOfFrets={numberOfFrets}
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        dotRadius={calculatedDotRadius}
        showNut={showNut}
        showFretMarkers={showFretMarkers}
        theme={theme}
        fontFamily={fontFamily}
        onDotPress={handleDotPress}
        onStringPress={toggleStringState}
        barreInProgress={barreInProgress}
        isEditable={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default GuitarFretboardEditor;
