import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import type {
  FretboardProps,
  FretboardConfig,
  FingerPosition,
  Barre,
  ChordData,
  EditMode,
  FingerNumber,
} from './types';
import { defaultTheme } from './theme';
import { generateBarreId } from './utils';

const DEFAULT_CONFIG: FretboardConfig = {
  stringCount: 6,
  visibleFrets: 7,
  startingFret: 1,
};

const STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'];

export const FretboardEnhanced: React.FC<FretboardProps> = ({
  mode = 'display',
  initialChord,
  editMode = 'dots',
  showFingerNumbers = false,
  onChordChange,
  onChordSave,
  onEditModeChange,
  config: userConfig,
  style,
  theme: userTheme,
}) => {
  const config = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...userConfig }),
    [userConfig]
  );

  const theme = useMemo(() => ({ ...defaultTheme, ...userTheme }), [userTheme]);

  const [positions, setPositions] = useState<FingerPosition[]>(
    initialChord?.positions || []
  );
  const [barres, setBarres] = useState<Barre[]>(initialChord?.barres || []);
  const [currentEditMode, setCurrentEditMode] = useState<EditMode>(editMode);

  // Barre creation state
  const [barreStartPosition, setBarreStartPosition] = useState<{
    fret: number;
    string: number;
  } | null>(null);

  // Scroll control
  const [scrollEnabled] = useState(true);

  // Use ref to store the latest onChordChange callback
  const onChordChangeRef = useRef(onChordChange);
  useEffect(() => {
    onChordChangeRef.current = onChordChange;
  });

  const screenWidth = Dimensions.get('window').width;
  const fretboardWidth = screenWidth * 0.9;
  const fretWidth = fretboardWidth / (config.visibleFrets + 1);
  const stringHeight = 50;
  const fretboardHeight = stringHeight * config.stringCount;

  useEffect(() => {
    if (!onChordChangeRef.current) return;

    const chordData: ChordData = {
      positions,
      barres,
      metadata: {
        startingFret: config.startingFret,
        visibleFrets: config.visibleFrets,
        hasFingerNumbers:
          positions.some((p) => p.finger !== undefined) ||
          barres.some((b) => b.finger !== undefined),
        isEmpty: positions.length === 0 && barres.length === 0,
        totalSpan: calculateTotalSpan(positions, barres),
      },
    };

    onChordChangeRef.current(chordData);
  }, [positions, barres, config.startingFret, config.visibleFrets]);

  const calculateTotalSpan = (
    positions: FingerPosition[],
    barres: Barre[]
  ): number => {
    const allFrets = [
      ...positions.map((p) => p.fret),
      ...barres.map((b) => b.fret),
    ];
    if (allFrets.length === 0) return 0;
    return Math.max(...allFrets) - Math.min(...allFrets) + 1;
  };

  const handleBarreCreation = useCallback(
    (string: number, fret: number) => {
      if (mode !== 'edit' || currentEditMode !== 'barres') return;

      if (!barreStartPosition) {
        // First tap - set start position
        setBarreStartPosition({ fret, string });
        return;
      }

      // Second tap - create barre if on same fret
      if (barreStartPosition.fret === fret) {
        const minString = Math.min(barreStartPosition.string, string);
        const maxString = Math.max(barreStartPosition.string, string);

        if (minString !== maxString) {
          const newBarre: Barre = {
            id: generateBarreId(),
            fret,
            fromString: minString,
            toString: maxString,
          };

          // Remove any existing positions that the barre covers
          setPositions((prev) =>
            prev.filter(
              (p) =>
                p.fret !== fret || p.string < minString || p.string > maxString
            )
          );

          setBarres((prev) => [...prev, newBarre]);
        }
      }

      // Clear start position after any second tap
      setBarreStartPosition(null);
    },
    [mode, currentEditMode, barreStartPosition]
  );

  const handleBarrePress = useCallback(
    (barreId: string) => {
      if (mode !== 'edit') return;

      if (currentEditMode === 'barres') {
        setBarres((prev) => prev.filter((b) => b.id !== barreId));
      } else if (currentEditMode === 'fingers') {
        const barre = barres.find((b) => b.id === barreId);
        if (barre) {
          const fingerOptions: FingerNumber[] = [1, 2, 3, 4];
          const currentFingerIndex = barre.finger
            ? fingerOptions.indexOf(barre.finger)
            : -1;
          const nextFingerIndex =
            (currentFingerIndex + 1) % (fingerOptions.length + 1);
          const nextFinger =
            nextFingerIndex === fingerOptions.length
              ? undefined
              : fingerOptions[nextFingerIndex];

          setBarres((prev) =>
            prev.map((b) =>
              b.id === barreId ? { ...b, finger: nextFinger } : b
            )
          );
        }
      }
    },
    [mode, currentEditMode, barres]
  );

  const handlePositionPress = useCallback(
    (string: number, fret: number) => {
      if (mode !== 'edit') return;

      // Handle barre mode with two-tap logic
      if (currentEditMode === 'barres') {
        handleBarreCreation(string, fret);
        return;
      }

      // Check if position is covered by a barre
      const coveredByBarre = barres.find(
        (b) => b.fret === fret && string >= b.fromString && string <= b.toString
      );

      // If we're in fingers mode and clicking on a barre, handle barre finger assignment
      if (currentEditMode === 'fingers' && coveredByBarre) {
        handleBarrePress(coveredByBarre.id);
        return;
      }

      if (currentEditMode === 'dots' && !coveredByBarre) {
        setPositions((prev) => {
          const existingIndex = prev.findIndex(
            (p) => p.string === string && p.fret === fret
          );

          if (existingIndex !== -1) {
            return prev.filter((_, i) => i !== existingIndex);
          } else {
            return [...prev, { string, fret }];
          }
        });
      } else if (currentEditMode === 'fingers') {
        const position = positions.find(
          (p) => p.string === string && p.fret === fret
        );
        if (position) {
          const fingerOptions: FingerNumber[] = [1, 2, 3, 4];
          const currentFingerIndex = position.finger
            ? fingerOptions.indexOf(position.finger)
            : -1;
          const nextFingerIndex =
            (currentFingerIndex + 1) % (fingerOptions.length + 1);
          const nextFinger =
            nextFingerIndex === fingerOptions.length
              ? undefined
              : fingerOptions[nextFingerIndex];

          setPositions((prev) =>
            prev.map((p) =>
              p.string === string && p.fret === fret
                ? { ...p, finger: nextFinger }
                : p
            )
          );
        }
      }
    },
    [
      mode,
      currentEditMode,
      positions,
      barres,
      handleBarrePress,
      handleBarreCreation,
    ]
  );

  const isPositionActive = useCallback(
    (string: number, fret: number) => {
      return positions.some((p) => p.string === string && p.fret === fret);
    },
    [positions]
  );

  const renderFretNumbers = () => {
    const fretNumbers = [];
    for (let i = 0; i <= config.visibleFrets; i++) {
      const fretNum = i === 0 ? '' : config.startingFret + i - 1;
      fretNumbers.push(
        <View
          key={`fret-num-${i}`}
          style={[
            styles.fretNumber,
            {
              width: fretWidth,
              left: i * fretWidth,
            },
          ]}
        >
          <Text
            style={[styles.fretNumberText, { color: theme.labelTextColor }]}
          >
            {fretNum}
          </Text>
        </View>
      );
    }
    return fretNumbers;
  };

  const renderStringNames = () => {
    return STRING_NAMES.map((name, index) => (
      <View
        key={`string-name-${index}`}
        style={[
          styles.stringName,
          {
            height: stringHeight,
            top: index * stringHeight,
          },
        ]}
      >
        <Text style={[styles.stringNameText, { color: theme.labelTextColor }]}>
          {name}
        </Text>
      </View>
    ));
  };

  const renderNut = () => {
    if (config.startingFret === 1) {
      return (
        <View
          style={[
            styles.nut,
            {
              height: fretboardHeight,
              backgroundColor: '#000000',
              left: fretWidth - 3,
              width: 6,
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

  const renderBarres = () => {
    const barreElements = [];

    // Render existing barres
    for (const barre of barres) {
      const barreHeight =
        (Math.abs(barre.toString - barre.fromString) + 1) * stringHeight - 12;
      const barreTop =
        Math.min(barre.fromString, barre.toString) * stringHeight + 6;

      barreElements.push(
        <TouchableOpacity
          key={barre.id}
          style={[
            styles.barre,
            {
              left: (barre.fret - 1 + 0.5) * fretWidth + fretWidth - 15,
              top: barreTop,
              width: 30,
              height: barreHeight,
              backgroundColor: '#000000',
            },
          ]}
          onPress={() => handleBarrePress(barre.id)}
          activeOpacity={0.6}
          disabled={mode === 'display'}
        >
          {showFingerNumbers && barre.finger && (
            <Text style={[styles.barreFingerNumber, { color: '#FFFFFF' }]}>
              {barre.finger}
            </Text>
          )}
        </TouchableOpacity>
      );
    }

    return barreElements;
  };

  const renderPositions = () => {
    const positionElements = [];
    for (let string = 0; string < config.stringCount; string++) {
      for (let fret = 1; fret <= config.visibleFrets; fret++) {
        const isActive = isPositionActive(string, fret);
        const position = positions.find(
          (p) => p.string === string && p.fret === fret
        );

        // Check if covered by barre
        const coveredByBarre = barres.some(
          (b) =>
            b.fret === fret && string >= b.fromString && string <= b.toString
        );

        // Check if this is the barre start position
        const isBarreStart =
          barreStartPosition &&
          barreStartPosition.fret === fret &&
          barreStartPosition.string === string;

        // Check if this is a valid barre end position
        const isValidBarreEnd =
          barreStartPosition &&
          barreStartPosition.fret === fret &&
          barreStartPosition.string !== string;

        positionElements.push(
          <TouchableOpacity
            key={`pos-${string}-${fret}`}
            style={[
              styles.positionArea,
              {
                left: (fret - 1) * fretWidth + fretWidth,
                top: string * stringHeight,
                width: fretWidth,
                height: stringHeight,
                backgroundColor: isBarreStart
                  ? 'rgba(59, 130, 246, 0.3)' // Blue highlight for start
                  : isValidBarreEnd
                    ? 'rgba(59, 130, 246, 0.2)' // Light blue for valid end
                    : 'transparent',
              },
            ]}
            onPress={() => handlePositionPress(string, fret)}
            activeOpacity={0.6}
            disabled={mode === 'display'}
          >
            {isActive && !coveredByBarre && (
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: '#000000',
                  },
                ]}
              >
                {showFingerNumbers && position?.finger && (
                  <Text style={[styles.fingerNumber, { color: '#FFFFFF' }]}>
                    {position.finger}
                  </Text>
                )}
              </View>
            )}
            {isBarreStart && (
              <View style={styles.barreStartIndicator}>
                <Text style={styles.barreStartText}>START</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      }
    }
    return positionElements;
  };

  const renderEditModeSelector = () => {
    if (mode !== 'edit') return null;

    return (
      <View style={styles.editModeContainer}>
        {(['dots', 'barres', 'fingers'] as EditMode[]).map((modeOption) => (
          <TouchableOpacity
            key={modeOption}
            style={[
              styles.editModeButton,
              currentEditMode === modeOption && styles.editModeButtonActive,
              {
                borderColor: theme.labelTextColor,
                backgroundColor:
                  currentEditMode === modeOption
                    ? theme.dotActiveColor
                    : 'transparent',
              },
            ]}
            onPress={() => {
              setCurrentEditMode(modeOption);
              setBarreStartPosition(null); // Clear barre start when switching modes
              onEditModeChange?.(modeOption);
            }}
          >
            <Text
              style={[
                styles.editModeText,
                {
                  color:
                    currentEditMode === modeOption
                      ? '#FFFFFF'
                      : theme.labelTextColor,
                },
              ]}
            >
              {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleSaveChord = () => {
    const chordData: ChordData = {
      positions,
      barres,
      metadata: {
        startingFret: config.startingFret,
        visibleFrets: config.visibleFrets,
        hasFingerNumbers:
          positions.some((p) => p.finger !== undefined) ||
          barres.some((b) => b.finger !== undefined),
        isEmpty: positions.length === 0 && barres.length === 0,
        totalSpan: calculateTotalSpan(positions, barres),
      },
    };
    onChordSave?.(chordData);
  };

  const handleClearFretboard = () => {
    setPositions([]);
    setBarres([]);
    setBarreStartPosition(null); // Clear barre start position
  };

  return (
    <View style={[styles.container, style]}>
      {renderEditModeSelector()}
      {mode === 'edit' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: '#ef4444' }]}
            onPress={handleClearFretboard}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: theme.dotActiveColor },
            ]}
            onPress={handleSaveChord}
          >
            <Text style={styles.buttonText}>Save Chord</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView
        horizontal
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.fretboardContainer}>
          <View style={styles.fretNumbersContainer}>{renderFretNumbers()}</View>
          <View style={styles.stringNamesContainer}>{renderStringNames()}</View>
          <View
            style={[
              styles.fretboard,
              {
                width: fretboardWidth,
                height: fretboardHeight,
                backgroundColor: '#FFFFFF',
                marginLeft: 30,
                borderWidth: 2,
                borderColor: '#000000',
              },
            ]}
          >
            {renderNut()}
            {renderStrings()}
            {renderFrets()}
            {renderBarres()}
            {renderPositions()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  fretboardContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  fretboard: {
    position: 'relative',
  },
  fretNumbersContainer: {
    position: 'relative',
    height: 25,
    marginLeft: 30,
  },
  stringNamesContainer: {
    position: 'absolute',
    left: 0,
    top: 55,
    width: 25,
  },
  stringName: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stringNameText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fretNumber: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fretNumberText: {
    fontSize: 12,
    fontWeight: '500',
  },
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
  positionArea: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  fingerNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  barre: {
    position: 'absolute',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  barrePreview: {
    position: 'absolute',
    borderRadius: 15,
    zIndex: 2,
  },
  barreFingerNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  editModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  editModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editModeButtonActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editModeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  barreStartIndicator: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  barreStartText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
});
