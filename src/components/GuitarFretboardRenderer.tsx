import React, { useMemo } from 'react';
import Svg, { Line, Circle, Text, Rect } from 'react-native-svg';
import type { FingerPosition } from '../types/FingerPosition';
import type { Barre } from '../types/Barre';

interface GuitarFretboardRendererProps {
  // Chord data
  dots: FingerPosition[];
  barres: Barre[];
  fingerNumbers: Map<string, number>;
  stringStates: Array<'X' | 'O'>;
  startingFret: number;

  // Display config
  numberOfStrings: number;
  numberOfFrets: number;
  gridWidth: number;
  gridHeight: number;
  dotRadius: number;
  showNut: boolean;
  showFretMarkers: boolean;

  // Optional interaction handlers (for editor mode)
  onDotPress?: (dot: FingerPosition) => void;
  onStringPress?: (index: number) => void;
  barreInProgress?: { fret: number; startString: number } | null;
  isEditable?: boolean;
}

const GuitarFretboardRenderer: React.FC<GuitarFretboardRendererProps> = ({
  dots,
  barres,
  fingerNumbers,
  stringStates,
  startingFret,
  numberOfStrings,
  numberOfFrets,
  gridWidth,
  gridHeight,
  dotRadius,
  showNut,
  showFretMarkers,
  onDotPress,
  onStringPress,
  barreInProgress,
  isEditable = false,
}) => {
  const HORIZONTAL_MARGIN = dotRadius;
  const VERTICAL_MARGIN = dotRadius * 3;

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

  const getDotKey = (dot: FingerPosition) => `${dot.string}-${dot.fret}`;

  const getBarreKey = (barre: Barre) =>
    `barre-${barre.fret}-${barre.startString}-${barre.endString}`;

  const isSelected = (dot: FingerPosition) =>
    dots.some((d) => d.string === dot.string && d.fret === dot.fret);

  return (
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

          const y = VERTICAL_MARGIN + dotRadius + (i + 0.5) * horizontalSpacing;
          const markerRadius = dotRadius * 0.4;

          if (doubleDotFrets.includes(fretNumber)) {
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
            const centerX =
              HORIZONTAL_MARGIN + ((numberOfStrings - 1) / 2) * verticalSpacing;

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
            <Rect
              x={leftX - dotRadius}
              y={cy - dotRadius * 0.8}
              width={width}
              height={dotRadius * 1.6}
              rx={dotRadius * 0.8}
              ry={dotRadius * 0.8}
              fill="black"
            />
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

      {/* Dots (clickable in editor mode) */}
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

          const barreThatIncludesDot = barres.find(
            (b) =>
              b.fret === dot.fret &&
              dot.string >= b.startString &&
              dot.string <= b.endString
          );

          const isBarreStartPosition =
            barreInProgress &&
            barreInProgress.fret === dot.fret &&
            barreInProgress.startString === dot.string;

          return (
            <React.Fragment key={`dot-${s}-${f}`}>
              {/* Touch target (only in editor mode) */}
              {isEditable && onDotPress && (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={dotRadius * 2}
                  fill="transparent"
                  onPress={() => onDotPress(dot)}
                />
              )}
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

      {/* String indicators (X or O) */}
      {Array.from({ length: numberOfStrings }).map((_, s) => {
        const x = HORIZONTAL_MARGIN + s * verticalSpacing;
        const y = VERTICAL_MARGIN - dotRadius;
        const state = stringStates[s];

        return (
          <React.Fragment key={`string-state-${s}`}>
            {/* Clickable area (only in editor mode) */}
            {isEditable && onStringPress && (
              <Circle
                cx={x}
                cy={y}
                r={dotRadius * 1.2}
                fill="transparent"
                onPress={() => onStringPress(s)}
              />
            )}

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
        const boxY = gridHeight - VERTICAL_MARGIN + dotRadius + dotRadius;
        const boxSize = dotRadius * 1.5;
        const stringNumber = numberOfStrings - s;

        return (
          <React.Fragment key={`string-number-${s}`}>
            <Rect
              x={x - boxSize / 2}
              y={boxY - boxSize / 2}
              width={boxSize}
              height={boxSize}
              fill="white"
              stroke="black"
              strokeWidth={1}
            />
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

      {/* Fret position label */}
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
  );
};

export default GuitarFretboardRenderer;
