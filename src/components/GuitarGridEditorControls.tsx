import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

type EditMode = 'dots' | 'barres';

interface GuitarGridEditorControlsProps {
  editMode?: EditMode;
  onEditModeChange?: (mode: EditMode) => void;
  onClear?: () => void;
  startingFret?: number;
  onStartingFretChange?: (fret: number) => void;
  onReset?: () => void;
  onShiftUp?: () => void;
  onShiftDown?: () => void;
  fontFamily?: string;
  isChordOutOfView?: boolean;
  onRecenter?: () => void;
}

const GuitarGridEditorControls: React.FC<GuitarGridEditorControlsProps> = ({
  editMode = 'dots',
  onEditModeChange = () => console.log('Edit mode changed'),
  onClear = () => console.log('Clear pressed'),
  startingFret = 1,
  onStartingFretChange = () => console.log('Starting fret changed'),
  onReset = () => console.log('Reset pressed'),
  onShiftUp = () => console.log('Shift Up pressed'),
  onShiftDown = () => console.log('Shift Down pressed'),
  fontFamily,
  isChordOutOfView = false,
  onRecenter = () => console.log('Recenter pressed'),
}) => {
  const handleClearPress = () => {
    onClear();
  };

  const handleResetPress = () => {
    onReset();
  };

  const handleDecrementFret = () => {
    if (startingFret > 1) {
      onStartingFretChange(startingFret - 1);
    }
  };

  const handleIncrementFret = () => {
    if (startingFret < 20) {
      onStartingFretChange(startingFret + 1);
    }
  };

  const handleFretInputChange = (text: string) => {
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= 1 && num <= 20) {
      onStartingFretChange(num);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Warning for out-of-view chord */}
      {isChordOutOfView && (
        <View style={styles.warningContainer}>
          <Text style={[styles.warningText, fontFamily && { fontFamily }]}>
            ⚠️ Chord is not visible in current view
          </Text>
          <TouchableOpacity style={styles.recenterButton} onPress={onRecenter}>
            <Text
              style={[styles.recenterButtonText, fontFamily && { fontFamily }]}
            >
              Recenter Chord
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Fret Position Control */}
      <View style={styles.fretControlContainer}>
        <Text style={[styles.fretLabel, fontFamily && { fontFamily }]}>
          Starting Fret:
        </Text>
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={[
              styles.stepperButton,
              startingFret <= 1 && styles.disabledButton,
            ]}
            onPress={handleDecrementFret}
            disabled={startingFret <= 1}
          >
            <Text
              style={[styles.stepperButtonText, fontFamily && { fontFamily }]}
            >
              -
            </Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.fretInput, fontFamily && { fontFamily }]}
            value={String(startingFret)}
            onChangeText={handleFretInputChange}
            keyboardType="number-pad"
            maxLength={2}
          />
          <TouchableOpacity
            style={[
              styles.stepperButton,
              startingFret >= 20 && styles.disabledButton,
            ]}
            onPress={handleIncrementFret}
            disabled={startingFret >= 20}
          >
            <Text
              style={[styles.stepperButtonText, fontFamily && { fontFamily }]}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Segmented Control for Edit Mode */}
      <View style={styles.modeControlContainer}>
        <Text style={[styles.modeLabel, fontFamily && { fontFamily }]}>
          Mode:
        </Text>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segment,
              styles.segmentLeft,
              editMode === 'dots' && styles.segmentActive,
            ]}
            onPress={() => onEditModeChange('dots')}
          >
            <Text
              style={[
                styles.segmentText,
                editMode === 'dots' && styles.segmentTextActive,
                fontFamily && { fontFamily },
              ]}
            >
              Dots
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segment,
              styles.segmentRight,
              editMode === 'barres' && styles.segmentActive,
            ]}
            onPress={() => onEditModeChange('barres')}
          >
            <Text
              style={[
                styles.segmentText,
                editMode === 'barres' && styles.segmentTextActive,
                fontFamily && { fontFamily },
              ]}
            >
              Barres
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Button Row */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearPress}
        >
          <Text
            style={[
              styles.buttonText,
              styles.clearButtonText,
              fontFamily && { fontFamily },
            ]}
          >
            Clear
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleResetPress}
        >
          <Text
            style={[
              styles.buttonText,
              styles.resetButtonText,
              fontFamily && { fontFamily },
            ]}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      {/* Shift Chord Shape Controls */}
      <View style={styles.shiftControlContainer}>
        <Text style={[styles.shiftLabel, fontFamily && { fontFamily }]}>
          Move Shape:
        </Text>
        <View style={styles.shiftButtonContainer}>
          <TouchableOpacity style={styles.shiftButton} onPress={onShiftDown}>
            <Text
              style={[styles.shiftButtonText, fontFamily && { fontFamily }]}
            >
              ↑
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shiftButton} onPress={onShiftUp}>
            <Text
              style={[styles.shiftButtonText, fontFamily && { fontFamily }]}
            >
              ↓
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  fretControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  fretLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    borderColor: '#ccc',
    opacity: 0.5,
  },
  stepperButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
  fretInput: {
    width: 50,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#11568fff',
    backgroundColor: 'white',
    alignItems: 'center',
    minWidth: 100,
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  activeButtonText: {
    color: 'white',
  },
  clearButton: {
    borderColor: '#dc3545',
  },
  clearButtonText: {
    color: '#dc3545',
  },
  resetButton: {
    borderColor: '#ff8c00',
  },
  resetButtonText: {
    color: '#ff8c00',
  },
  shiftControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  shiftLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  shiftButtonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  shiftButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#28a745',
    backgroundColor: 'white',
    minWidth: 80,
    alignItems: 'center',
  },
  shiftButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#28a745',
  },
  modeControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  segment: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentLeft: {
    borderRightWidth: 0.5,
    borderRightColor: '#007AFF',
  },
  segmentRight: {
    borderLeftWidth: 0.5,
    borderLeftColor: '#007AFF',
  },
  segmentActive: {
    backgroundColor: '#007AFF',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  segmentTextActive: {
    color: 'white',
  },
  warningContainer: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
  },
  warningText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
    textAlign: 'center',
  },
  recenterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#ffc107',
    borderWidth: 1,
    borderColor: '#d39e00',
  },
  recenterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#856404',
  },
});

export default GuitarGridEditorControls;
