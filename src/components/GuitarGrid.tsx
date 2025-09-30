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
  const VERTICAL_MARGIN = dotRadius;

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
  const [stringStates, setStringStates] = useState<Array<'X' | 'O'>>(
    Array(numberOfStrings).fill('O') // Default to open strings
  );

  const handleDotPress = (dot: FingerPosition) => {
    setSelectedDots((prev) => {
      const exists = prev.some(
        (d) => d.string === dot.string && d.fret === dot.fret
      );
      if (exists) {
        return prev.filter(
          (d) => !(d.string === dot.string && d.fret === dot.fret)
        );
      } else {
        return [...prev, dot];
      }
    });
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

  return (
    <View>
      <GuitarGridEditorControls />
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
            return (
              <Circle
                key={`dot-${s}-${f}`}
                cx={cx}
                cy={cy}
                r={dotRadius}
                fill={isSelected(dot) ? 'blue' : 'transparent'}
                stroke={isSelected(dot) ? 'black' : 'none'}
                onPress={() => handleDotPress(dot)}
              />
            );
          })
        )}

        {/* String indicators (just big O or X characters) */}
        {Array.from({ length: numberOfStrings }).map((_, s) => {
          const x = HORIZONTAL_MARGIN + s * verticalSpacing;
          const y = VERTICAL_MARGIN / 2; // above the nut
          const state = stringStates[s];

          return (
            <React.Fragment key={`string-state-${s}`}>
              {/* Invisible clickable area */}
              <Circle
                cx={x}
                cy={y}
                r={dotRadius}
                fill="transparent"
                onPress={() => toggleStringState(s)}
              />

              {/* Show X or O based on state */}
              {state === 'X' && (
                <Text
                  x={x}
                  y={y + 6}
                  fontSize={dotRadius * 1.5}
                  fontWeight="bold"
                  fill="red"
                  textAnchor="middle"
                >
                  X
                </Text>
              )}

              {state === 'O' && (
                <Text
                  x={x}
                  y={y + 6}
                  fontSize={dotRadius * 1.5}
                  fontWeight="bold"
                  fill="black"
                  textAnchor="middle"
                >
                  O
                </Text>
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
