import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GuitarGridEditorControlsProps {
  isEditingFingers?: boolean;
  onEditFingers?: () => void;
  isAddingBarres?: boolean;
  onAddBarres?: () => void;
  onClear?: () => void;
}

const GuitarGridEditorControls: React.FC<GuitarGridEditorControlsProps> = ({
  isEditingFingers = false,
  onEditFingers = () => console.log('Edit Fingers pressed'),
  isAddingBarres = false,
  onAddBarres = () => console.log('Add Barres pressed'),
  onClear = () => console.log('Clear pressed'),
}) => {
  const handleEditFingersPress = () => {
    onEditFingers();
  };

  const handleAddBarresPress = () => {
    onAddBarres();
  };

  const handleClearPress = () => {
    onClear();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isAddingBarres && styles.activeButton]}
        onPress={handleAddBarresPress}
      >
        <Text
          style={[styles.buttonText, isAddingBarres && styles.activeButtonText]}
        >
          {isAddingBarres ? 'Done' : 'Add Barres'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, isEditingFingers && styles.activeButton]}
        onPress={handleEditFingersPress}
      >
        <Text
          style={[
            styles.buttonText,
            isEditingFingers && styles.activeButtonText,
          ]}
        >
          {isEditingFingers ? 'Done' : 'Edit Fingers'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.clearButton]}
        onPress={handleClearPress}
      >
        <Text style={[styles.buttonText, styles.clearButtonText]}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
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
    minWidth: 120,
  },
  activeButton: {
    backgroundColor: '#007AFF', // iOS blue
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
});

export default GuitarGridEditorControls;
