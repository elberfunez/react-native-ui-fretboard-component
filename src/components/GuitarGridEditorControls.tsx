import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GuitarGridEditorControlsProps {
  isEditingFingers?: boolean;
  onEditFingers?: () => void;
}

const GuitarGridEditorControls: React.FC<GuitarGridEditorControlsProps> = ({
  isEditingFingers = false,
  onEditFingers = () => console.log('Edit Fingers pressed'),
}) => {
  const handlePress = () => {
    onEditFingers();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isEditingFingers && styles.activeButton]}
        onPress={handlePress}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
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
});

export default GuitarGridEditorControls;
