import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg, { Line, Circle, Text, Rect } from 'react-native-svg';
import type { FingerPosition } from '../types/FingerPosition';
import GuitarGridEditorControls from './GuitarGridEditorControls';

interface GuitarGridProps {
  numberOfStrings?: number;
  numberOfFrets?: number;
  gridWidth?: number;
  gridHeight?: number;
  showNut?: boolean;
  dotRadius?: number; // tappable area for dots and indicators
  isEditingFingers?: boolean;
}

const DEFAULT_GRID_CONFIG: Required<GuitarGridProps> = {
  numberOfStrings: 6,
  numberOfFrets: 5,
  gridWidth: 200,
  gridHeight: 250,
  showNut: true,
  dotRadius: 12,
  isEditingFingers: false,
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
    Array(numberOfStrings).fill('O') // Default to open strings
  );
  const [isEditingFingers, setIsEditingFingers] = useState(false);

  const getDotKey = (dot: FingerPosition) => `${dot.string}-${dot.fret}`;

  const handleDotPress = (dot: FingerPosition) => {
    if (isEditingFingers) {
      // In edit mode, cycle finger numbers 1-4, then remove
      const key = getDotKey(dot);
      setFingerNumbers((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(key) || 0;
        if (current >= 4) {
          newMap.delete(key);
        } else {
          newMap.set(key, current + 1);
        }
        return newMap;
      });

      // Make sure the dot is selected if assigning a finger number
      if (!isSelected(dot) && (fingerNumbers.get(key) || 0) < 4) {
        setSelectedDots((prev) => [...prev, dot]);
      }
    } else {
      // Normal mode: toggle dot selection
      setSelectedDots((prev) => {
        const exists = prev.some(
          (d) => d.string === dot.string && d.fret === dot.fret
        );
        if (exists) {
          // Remove finger number when removing dot
          const key = getDotKey(dot);
          setFingerNumbers((prevNumbers) => {
            const newMap = new Map(prevNumbers);
            newMap.delete(key);
            return newMap;
          });
          return prev.filter(
            (d) => !(d.string === dot.string && d.fret === dot.fret)
          );
        } else {
          return [...prev, dot];
        }
      });
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

  const handleEditFingersPress = () => {
    setIsEditingFingers(!isEditingFingers);
  };

  return (
    <View>
      <GuitarGridEditorControls
        onEditFingers={handleEditFingersPress}
        isEditingFingers={isEditingFingers}
      />
      <Svg
        width={gridWidth}
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
              strokeWidth={i === 0 && showNut ? 4 : 2}
            />
          );
        })}

        {/* Clickable dots */}
        {Array.from({ length: numberOfStrings }).map((__, s) =>
          Array.from({ length: numberOfFrets }).map((_, f) => {
            const dot: FingerPosition = { string: s + 1, fret: f + 1 };
            const cx = HORIZONTAL_MARGIN + s * verticalSpacing;
            const cy =
              VERTICAL_MARGIN + dotRadius + (f + 0.5) * horizontalSpacing;
            const dotKey = getDotKey(dot);
            const fingerNumber = fingerNumbers.get(dotKey);

            return (
              <React.Fragment key={`dot-${s}-${f}`}>
                <Circle
                  cx={cx}
                  cy={cy}
                  r={dotRadius}
                  fill={isSelected(dot) ? 'black' : 'transparent'}
                  stroke="none"
                  onPress={() => handleDotPress(dot)}
                />
                {/* Show finger number if assigned */}
                {fingerNumber && (
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
      </Svg>
    </View>
  );
};

export default GuitarGrid;
