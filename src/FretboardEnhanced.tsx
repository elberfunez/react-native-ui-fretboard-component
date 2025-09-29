import React, { useMemo, useEffect, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import type { FretboardProps, FretboardConfig, ChordData } from './types';
import { defaultTheme } from './theme';
import { useFretboardDimensions } from './hooks/useFretboardDimensions';
import { useFretboardState } from './hooks/useFretboardState';
import { useFretboardEdit } from './hooks/useFretboardEdit';
import { FretboardGrid } from './components/FretboardGrid';
import { FretboardLabels } from './components/FretboardLabels';
import { FretboardBarres } from './components/FretboardBarres';
import { FretboardPositions } from './components/FretboardPositions';
import { EditModeControls } from './components/EditModeControls';
import { fretboardStyles } from './styles/fretboard.styles';

const DEFAULT_CONFIG: FretboardConfig = {
  stringCount: 6,
  visibleFrets: 7,
  startingFret: 1,
};

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

  const {
    positions,
    setPositions,
    barres,
    setBarres,
    currentEditMode,
    setCurrentEditMode,
    barreStartPosition,
    setBarreStartPosition,
    isPositionActive,
    calculateTotalSpan,
    clearFretboard,
  } = useFretboardState(
    initialChord?.positions,
    initialChord?.barres,
    editMode
  );

  const dimensions = useFretboardDimensions(config);

  const { handlePositionPress, handleBarrePress } = useFretboardEdit({
    mode,
    currentEditMode,
    positions,
    barres,
    barreStartPosition,
    setPositions,
    setBarres,
    setBarreStartPosition,
  });

  const onChordChangeRef = useRef(onChordChange);
  useEffect(() => {
    onChordChangeRef.current = onChordChange;
  });

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
  }, [
    positions,
    barres,
    config.startingFret,
    config.visibleFrets,
    calculateTotalSpan,
  ]);

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

  return (
    <View style={[fretboardStyles.container, style]}>
      <EditModeControls
        mode={mode}
        currentEditMode={currentEditMode}
        theme={theme}
        onEditModeChange={onEditModeChange}
        onClear={clearFretboard}
        onSave={handleSaveChord}
        setCurrentEditMode={setCurrentEditMode}
        setBarreStartPosition={setBarreStartPosition}
      />
      <ScrollView
        horizontal
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={fretboardStyles.scrollContent}
      >
        <View style={fretboardStyles.fretboardContainer}>
          <FretboardLabels
            config={config}
            fretWidth={dimensions.fretWidth}
            stringHeight={dimensions.stringHeight}
            theme={theme}
          />
          <View
            style={[
              fretboardStyles.fretboard,
              {
                width: dimensions.fretboardWidth,
                height: dimensions.fretboardHeight,
                backgroundColor: '#FFFFFF',
                borderWidth: 2,
                borderColor: '#000000',
              },
            ]}
          >
            <FretboardGrid
              config={config}
              fretWidth={dimensions.fretWidth}
              stringHeight={dimensions.stringHeight}
              fretboardWidth={dimensions.fretboardWidth}
              fretboardHeight={dimensions.fretboardHeight}
            />
            <FretboardBarres
              barres={barres}
              fretWidth={dimensions.fretWidth}
              stringHeight={dimensions.stringHeight}
              showFingerNumbers={showFingerNumbers}
              mode={mode}
              onBarrePress={handleBarrePress}
            />
            <FretboardPositions
              config={config}
              positions={positions}
              barres={barres}
              barreStartPosition={barreStartPosition}
              fretWidth={dimensions.fretWidth}
              stringHeight={dimensions.stringHeight}
              showFingerNumbers={showFingerNumbers}
              mode={mode}
              isPositionActive={isPositionActive}
              onPositionPress={handlePositionPress}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
