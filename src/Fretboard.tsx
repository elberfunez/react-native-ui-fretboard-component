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
} from './types';
import { defaultTheme } from './theme';

const DEFAULT_CONFIG: FretboardConfig = {
  stringCount: 6,
  visibleFrets: 7,
  startingFret: 1,
};

const STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'];

export const Fretboard: React.FC<FretboardProps> = ({
  mode = 'display',
  initialChord,
  editMode = 'dots',
  showFingerNumbers = false,
  onChordChange,
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
  const [barres] = useState<Barre[]>(initialChord?.barres || []);
  const [currentEditMode, setCurrentEditMode] = useState<EditMode>(editMode);

  // Use ref to store the latest onChordChange callback
  const onChordChangeRef = useRef(onChordChange);
  useEffect(() => {
    onChordChangeRef.current = onChordChange;
  });

  const screenWidth = Dimensions.get('window').width;
  const fretboardWidth = screenWidth * 0.9;
  const fretWidth = fretboardWidth / (config.visibleFrets + 1);
  const stringHeight = 40;
  const fretboardHeight = stringHeight * config.stringCount;

  useEffect(() => {
    if (!onChordChangeRef.current) return;

    const chordData: ChordData = {
      positions,
      barres,
      metadata: {
        startingFret: config.startingFret,
        visibleFrets: config.visibleFrets,
        hasFingerNumbers: positions.some((p) => p.finger !== undefined),
        isEmpty: positions.length === 0 && barres.length === 0,
        totalSpan: calculateTotalSpan(positions),
      },
    };

    onChordChangeRef.current(chordData);
  }, [positions, barres, config.startingFret, config.visibleFrets]);

  const calculateTotalSpan = (positions: FingerPosition[]): number => {
    if (positions.length === 0) return 0;
    const frets = positions.map((p) => p.fret);
    return Math.max(...frets) - Math.min(...frets) + 1;
  };

  const handlePositionPress = useCallback(
    (string: number, fret: number) => {
      if (mode !== 'edit') return;

      if (currentEditMode === 'dots') {
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
      }
    },
    [mode, currentEditMode]
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
              backgroundColor: theme.nutColor,
              left: fretWidth - 2,
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
              backgroundColor: theme.stringColor,
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
              backgroundColor: theme.fretColor,
            },
          ]}
        />
      );
    }
    return frets;
  };

  const renderPositions = () => {
    const positionElements = [];
    for (let string = 0; string < config.stringCount; string++) {
      for (let fret = 1; fret <= config.visibleFrets; fret++) {
        const isActive = isPositionActive(string, fret);
        const position = positions.find(
          (p) => p.string === string && p.fret === fret
        );

        positionElements.push(
          <TouchableOpacity
            key={`pos-${string}-${fret}`}
            style={[
              styles.positionArea,
              {
                left: (fret - 1 + 0.5) * fretWidth + fretWidth,
                top: string * stringHeight,
                width: fretWidth,
                height: stringHeight,
              },
            ]}
            onPress={() => handlePositionPress(string, fret)}
            activeOpacity={0.6}
            disabled={mode !== 'edit'}
          >
            {isActive && (
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      mode === 'edit' ? theme.dotActiveColor : theme.dotColor,
                  },
                ]}
              >
                {showFingerNumbers && position?.finger && (
                  <Text
                    style={[
                      styles.fingerNumber,
                      { color: theme.fingerNumberColor },
                    ]}
                  >
                    {position.finger}
                  </Text>
                )}
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

  return (
    <View style={[styles.container, style]}>
      {renderEditModeSelector()}
      <ScrollView
        horizontal
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
                backgroundColor: theme.fretboardColor,
                marginLeft: 30,
              },
            ]}
          >
            {renderNut()}
            {renderStrings()}
            {renderFrets()}
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
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fretNumbersContainer: {
    position: 'relative',
    height: 25,
    marginLeft: 30,
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
  nut: {
    position: 'absolute',
    width: 4,
    zIndex: 2,
  },
  string: {
    position: 'absolute',
    height: 1,
    zIndex: 1,
  },
  fret: {
    position: 'absolute',
    width: 1,
    zIndex: 1,
  },
  positionArea: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerNumber: {
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
});
