import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Text, Rect } from 'react-native-svg';
import type { FingerPosition } from '../types/FingerPosition';
import type { Barre } from '../types/Barre';
import GuitarGridEditorControls from './GuitarGridEditorControls';
import ChordLabel from './ChordLabel';
import { useChordDetection } from '../hooks/useChordDetection';

interface GuitarGridProps {
  numberOfStrings?: number;
  numberOfFrets?: number;
  gridWidth?: number;
  gridHeight?: number;
  showNut?: boolean;
  dotRadius?: number; // tappable area for dots and indicators
  isEditingFingers?: boolean;
  showFretMarkers?: boolean; // show traditional fret markers (dots on frets 3, 5, 7, 9, 12, etc.)
}

const DEFAULT_GRID_CONFIG: Required<GuitarGridProps> = {
  numberOfStrings: 6,
  numberOfFrets: 5,
  gridWidth: 200,
  gridHeight: 250,
  showNut: true,
  dotRadius: 12,
  isEditingFingers: false,
  showFretMarkers: true,
};

const GuitarGrid: React.FC<GuitarGridProps> = (props) => {
  const config: Required<GuitarGridProps> = useMemo(
    () => ({ ...DEFAULT_GRID_CONFIG, ...props }),
    [props]
  );

  const {
    numberOfStrings,
    numberOfFrets,
    gridWidth,
    gridHeight,
    showNut,
    dotRadius,
    showFretMarkers,
  } = config;

  const HORIZONTAL_MARGIN = dotRadius;
  const VERTICAL_MARGIN = dotRadius * 3; // Extra space for string indicators

  const { verticalSpacing, horizontalSpacing } = useMemo(
    () => ({
      verticalSpacing:
        (gridWidth - 2 * HORIZONTAL_MARGIN) / (numberOfStrings - 1),
      horizontalSpacing: (gridHeight - 2 * VERTICAL_MARGIN) / numberOfFrets,
    }),
    [
      gridWidth,
      gridHeight,
      numberOfStrings,
      numberOfFrets,
      HORIZONTAL_MARGIN,
      VERTICAL_MARGIN,
    ]
  );

  const [selectedDots, setSelectedDots] = useState<FingerPosition[]>([]);
  const [fingerNumbers, setFingerNumbers] = useState<Map<string, number>>(
    new Map()
  );
  const [stringStates, setStringStates] = useState<Array<'X' | 'O'>>(
    Array(numberOfStrings).fill('O') // Default to open strings (empty fretboard)
  );
  const [barres, setBarres] = useState<Barre[]>([]);
  const [barreInProgress, setBarreInProgress] = useState<{
    fret: number;
    startString: number;
  } | null>(null);
  const [startingFret, setStartingFret] = useState(1);

  const getDotKey = (dot: FingerPosition) => `${dot.string}-${dot.fret}`;

  const getBarreKey = (barre: Barre) =>
    `barre-${barre.fret}-${barre.startString}-${barre.endString}`;

  const handleDotPress = (dot: FingerPosition) => {
    if (isAddingBarres) {
      // Barre mode: select start and end string on same fret
      if (!barreInProgress) {
        // First click: set start string and fret
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
      // Cycle through: O -> X -> O
      if (prev[index] === 'O') {
        newStates[index] = 'X';
      } else {
        newStates[index] = 'O';
      }
      return newStates;
    });
  };

  const isSelected = (dot: FingerPosition) =>
    selectedDots.some((d) => d.string === dot.string && d.fret === dot.fret);

  const [isAddingBarres, setIsAddingBarres] = useState(false);

  const handleAddBarresPress = () => {
    setIsAddingBarres(!isAddingBarres);
    // Reset barre in progress when toggling mode
    setBarreInProgress(null);
  };

  const handleClearPress = () => {
    setSelectedDots([]);
    setFingerNumbers(new Map());
    setBarres([]);
    setBarreInProgress(null);
    setStringStates(Array(numberOfStrings).fill('O'));
    // Keep startingFret unchanged
  };

  const handleResetPress = () => {
    setSelectedDots([]);
    setFingerNumbers(new Map());
    setBarres([]);
    setBarreInProgress(null);
    setStringStates(Array(numberOfStrings).fill('O'));
    setStartingFret(1); // Reset to fret 1
  };

  const handleShiftUp = () => {
    // Shift all dots and barres up by 1 fret (increase fret number)
    // Don't allow going above fret 24
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
            // Barre key format: barre-{fret}-{startString}-{endString}
            const parts = key.split('-');
            const fret = parts[1];
            const startString = parts[2];
            const endString = parts[3];
            if (fret && startString && endString) {
              const newKey = `barre-${parseInt(fret, 10) + 1}-${startString}-${endString}`;
              newMap.set(newKey, value);
            }
          } else {
            // Dot key format: {string}-{fret}
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
        // Keep 1 fret buffer above the highest note
        const newStartingFret = Math.min(newMaxFret - numberOfFrets + 2, 20);
        setStartingFret(Math.max(1, newStartingFret));
      }
    }
  };

  const handleShiftDown = () => {
    // Shift all dots and barres down by 1 fret (decrease fret number)
    // Don't allow going below fret 1
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
            // Barre key format: barre-{fret}-{startString}-{endString}
            const parts = key.split('-');
            const fret = parts[1];
            const startString = parts[2];
            const endString = parts[3];
            if (fret && startString && endString) {
              const newKey = `barre-${parseInt(fret, 10) - 1}-${startString}-${endString}`;
              newMap.set(newKey, value);
            }
          } else {
            // Dot key format: {string}-{fret}
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
        // Keep 1 fret buffer below the lowest note
        const newStartingFret = newMinFret - 1;
        setStartingFret(Math.max(1, newStartingFret));
      }
    }
  };

  // Detect chord based on current fretboard state
  const { notes, primaryChord } = useChordDetection(
    selectedDots,
    stringStates,
    barres
  );

  return (
    <View style={styles.container}>
      <ChordLabel chordName={primaryChord} notes={notes} />
      <GuitarGridEditorControls
        onAddBarres={handleAddBarresPress}
        isAddingBarres={isAddingBarres}
        onClear={handleClearPress}
        startingFret={startingFret}
        onStartingFretChange={setStartingFret}
        onReset={handleResetPress}
        onShiftUp={handleShiftUp}
        onShiftDown={handleShiftDown}
      />
      <Svg
        width={gridWidth + 40 /* extra space for fret position label */}
        height={
          gridHeight +
          dotRadius * 4 /* extra space for string indicators + string numbers */
        }
      >
        {/* Vertical lines (strings) */}
        {Array.from({ length: numberOfStrings }).map((_, i) => {
          const x = HORIZONTAL_MARGIN + i * verticalSpacing;
          return (
            <Line
              key={`string-${i}`}
              x1={x}
              y1={VERTICAL_MARGIN + dotRadius}
              x2={x}
              y2={gridHeight - VERTICAL_MARGIN + dotRadius}
              stroke="black"
              strokeWidth={2}
            />
          );
        })}

        {/* Horizontal lines (frets) */}
        {Array.from({ length: numberOfFrets + 1 }).map((_, i) => {
          const y = VERTICAL_MARGIN + dotRadius + i * horizontalSpacing;
          return (
            <Line
              key={`fret-${i}`}
              x1={HORIZONTAL_MARGIN}
              y1={y}
              x2={gridWidth - HORIZONTAL_MARGIN}
              y2={y}
              stroke="black"
              strokeWidth={i === 0 && showNut && startingFret === 1 ? 8 : 2}
            />
          );
        })}

        {/* Fret markers (traditional guitar position dots) */}
        {showFretMarkers &&
          Array.from({ length: numberOfFrets }).map((_, i) => {
            const fretNumber = startingFret + i;
            const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
            const doubleDotFrets = [12, 24];

            if (!markerFrets.includes(fretNumber)) return null;

            const y =
              VERTICAL_MARGIN + dotRadius + (i + 0.5) * horizontalSpacing;
            const markerRadius = dotRadius * 0.4; // Subtle size

            if (doubleDotFrets.includes(fretNumber)) {
              // Double dots for 12th and 24th fret
              const leftX =
                HORIZONTAL_MARGIN +
                ((numberOfStrings - 1) / 2 - 0.7) * verticalSpacing;
              const rightX =
                HORIZONTAL_MARGIN +
                ((numberOfStrings - 1) / 2 + 0.7) * verticalSpacing;

              return (
                <React.Fragment key={`marker-${i}`}>
                  <Circle
                    cx={leftX}
                    cy={y}
                    r={markerRadius}
                    fill="#d0d0d0"
                    opacity={0.5}
                  />
                  <Circle
                    cx={rightX}
                    cy={y}
                    r={markerRadius}
                    fill="#d0d0d0"
                    opacity={0.5}
                  />
                </React.Fragment>
              );
            } else {
              // Single dot for other marker frets
              const centerX =
                HORIZONTAL_MARGIN +
                ((numberOfStrings - 1) / 2) * verticalSpacing;

              return (
                <Circle
                  key={`marker-${i}`}
                  cx={centerX}
                  cy={y}
                  r={markerRadius}
                  fill="#d0d0d0"
                  opacity={0.5}
                />
              );
            }
          })}

        {/* Barres (render before dots) */}
        {barres.map((barre, idx) => {
          const startX =
            HORIZONTAL_MARGIN +
            (numberOfStrings - barre.startString) * verticalSpacing;
          const endX =
            HORIZONTAL_MARGIN +
            (numberOfStrings - barre.endString) * verticalSpacing;

          // Ensure leftX is the leftmost position (smaller X value)
          const leftX = Math.min(startX, endX);
          const rightX = Math.max(startX, endX);
          const centerX = (leftX + rightX) / 2;
          const width = rightX - leftX + dotRadius * 2;
          const cy =
            VERTICAL_MARGIN +
            dotRadius +
            (barre.fret - startingFret + 0.5) * horizontalSpacing;
          const barreKey = getBarreKey(barre);
          const fingerNumber = fingerNumbers.get(barreKey);

          return (
            <React.Fragment key={`barre-${idx}`}>
              {/* Rounded rectangle (capsule) for barre */}
              <Rect
                x={leftX - dotRadius}
                y={cy - dotRadius * 0.8}
                width={width}
                height={dotRadius * 1.6}
                rx={dotRadius * 0.8}
                ry={dotRadius * 0.8}
                fill="black"
              />
              {/* Show finger number on barre */}
              {fingerNumber && (
                <Text
                  x={centerX}
                  y={cy + dotRadius * 0.4}
                  fontSize={dotRadius * 1.3}
                  fontWeight="bold"
                  fill="white"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {fingerNumber}
                </Text>
              )}
            </React.Fragment>
          );
        })}

        {/* Clickable dots */}
        {Array.from({ length: numberOfStrings }).map((__, s) =>
          Array.from({ length: numberOfFrets }).map((_, f) => {
            const dot: FingerPosition = {
              string: numberOfStrings - s,
              fret: startingFret + f,
            };
            const cx = HORIZONTAL_MARGIN + s * verticalSpacing;
            const cy =
              VERTICAL_MARGIN + dotRadius + (f + 0.5) * horizontalSpacing;
            const dotKey = getDotKey(dot);
            const fingerNumber = fingerNumbers.get(dotKey);

            // Check if this dot is part of a barre
            const barreThatIncludesDot = barres.find(
              (b) =>
                b.fret === dot.fret &&
                dot.string >= b.startString &&
                dot.string <= b.endString
            );

            // Check if this is the barre in progress start position
            const isBarreStartPosition =
              barreInProgress &&
              barreInProgress.fret === dot.fret &&
              barreInProgress.startString === dot.string;

            const handleDotOrBarrePress = () => {
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
              } else {
                // Normal dot press
                handleDotPress(dot);
              }
            };

            return (
              <React.Fragment key={`dot-${s}-${f}`}>
                {/* Larger invisible touch target */}
                <Circle
                  cx={cx}
                  cy={cy}
                  r={dotRadius * 2}
                  fill="transparent"
                  onPress={handleDotOrBarrePress}
                />
                {/* Visible dot */}
                <Circle
                  cx={cx}
                  cy={cy}
                  r={dotRadius}
                  fill={
                    barreThatIncludesDot
                      ? 'transparent'
                      : isSelected(dot)
                        ? 'black'
                        : 'transparent'
                  }
                  stroke={isBarreStartPosition ? '#007AFF' : 'none'}
                  strokeWidth={isBarreStartPosition ? 3 : 0}
                  pointerEvents="none"
                />
                {/* Show finger number if assigned and not part of barre */}
                {fingerNumber && !barreThatIncludesDot && (
                  <Text
                    x={cx}
                    y={cy + dotRadius * 0.4}
                    fontSize={dotRadius * 1.3}
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {fingerNumber}
                  </Text>
                )}
              </React.Fragment>
            );
          })
        )}

        {/* String indicators (circles for O, X text for muted) */}
        {Array.from({ length: numberOfStrings }).map((_, s) => {
          const x = HORIZONTAL_MARGIN + s * verticalSpacing;
          const y = VERTICAL_MARGIN - dotRadius; // above the nut with more space
          const state = stringStates[s];

          return (
            <React.Fragment key={`string-state-${s}`}>
              {/* Larger clickable area */}
              <Circle
                cx={x}
                cy={y}
                r={dotRadius * 1.2}
                fill="transparent"
                onPress={() => toggleStringState(s)}
              />

              {/* Show X or circle based on state */}
              {state === 'X' && (
                <Text
                  x={x}
                  y={y + 6}
                  fontSize={dotRadius * 1.5}
                  fontWeight="bold"
                  fill="black"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  X
                </Text>
              )}

              {state === 'O' && (
                <Circle
                  cx={x}
                  cy={y}
                  r={dotRadius * 0.6}
                  fill="white"
                  stroke="black"
                  strokeWidth={2}
                  pointerEvents="none"
                />
              )}
            </React.Fragment>
          );
        })}

        {/* String numbers in boxes below the fretboard */}
        {Array.from({ length: numberOfStrings }).map((_, s) => {
          const x = HORIZONTAL_MARGIN + s * verticalSpacing;
          const boxY = gridHeight - VERTICAL_MARGIN + dotRadius + dotRadius; // below the fretboard
          const boxSize = dotRadius * 1.5;
          const stringNumber = numberOfStrings - s; // 6, 5, 4, 3, 2, 1 (reverse order)

          return (
            <React.Fragment key={`string-number-${s}`}>
              {/* Box background */}
              <Rect
                x={x - boxSize / 2}
                y={boxY - boxSize / 2}
                width={boxSize}
                height={boxSize}
                fill="white"
                stroke="black"
                strokeWidth={1}
              />

              {/* String number text */}
              <Text
                x={x}
                y={boxY + 4}
                fontSize={dotRadius}
                fontWeight="bold"
                fill="black"
                textAnchor="middle"
              >
                {stringNumber}
              </Text>
            </React.Fragment>
          );
        })}

        {/* Fret position label (only show when starting fret > 1) */}
        {startingFret > 1 && (
          <Text
            x={gridWidth - HORIZONTAL_MARGIN + 10}
            y={VERTICAL_MARGIN + dotRadius + 4}
            fontSize={18}
            fontWeight="bold"
            fill="#333"
            textAnchor="start"
          >
            {startingFret}fr
          </Text>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default GuitarGrid;
