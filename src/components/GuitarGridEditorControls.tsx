import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

interface GuitarGridEditorControlsProps {
  isAddingBarres?: boolean;
  onAddBarres?: () => void;
  onClear?: () => void;
  startingFret?: number;
  onStartingFretChange?: (fret: number) => void;
  onReset?: () => void;
  onShiftUp?: () => void;
  onShiftDown?: () => void;
}

const GuitarGridEditorControls: React.FC<GuitarGridEditorControlsProps> = ({
  isAddingBarres = false,
  onAddBarres = () => console.log('Add Barres pressed'),
  onClear = () => console.log('Clear pressed'),
  startingFret = 1,
  onStartingFretChange = () => console.log('Starting fret changed'),
  onReset = () => console.log('Reset pressed'),
  onShiftUp = () => console.log('Shift Up pressed'),
  onShiftDown = () => console.log('Shift Down pressed'),
}) => {
  const handleAddBarresPress = () => {
    onAddBarres();
  };

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
      {/* Fret Position Control */}
      <View style={styles.fretControlContainer}>
        <Text style={styles.fretLabel}>Starting Fret:</Text>
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={[
              styles.stepperButton,
              startingFret <= 1 && styles.disabledButton,
            ]}
            onPress={handleDecrementFret}
            disabled={startingFret <= 1}
          >
            <Text style={styles.stepperButtonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.fretInput}
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
            <Text style={styles.stepperButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Button Row */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isAddingBarres && styles.activeButton]}
          onPress={handleAddBarresPress}
        >
          <Text
            style={[
              styles.buttonText,
              isAddingBarres && styles.activeButtonText,
            ]}
          >
            {isAddingBarres ? 'Done' : 'Add Barres'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearPress}
        >
          <Text style={[styles.buttonText, styles.clearButtonText]}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleResetPress}
        >
          <Text style={[styles.buttonText, styles.resetButtonText]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Shift Chord Shape Controls */}
      <View style={styles.shiftControlContainer}>
        <Text style={styles.shiftLabel}>Move Shape:</Text>
        <View style={styles.shiftButtonContainer}>
          <TouchableOpacity style={styles.shiftButton} onPress={onShiftDown}>
            <Text style={styles.shiftButtonText}>↓ Down</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shiftButton} onPress={onShiftUp}>
            <Text style={styles.shiftButtonText}>↑ Up</Text>
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
});

export default GuitarGridEditorControls;
