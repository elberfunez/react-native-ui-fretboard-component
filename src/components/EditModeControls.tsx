import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { EditMode, FretboardTheme } from '../types';

interface EditModeControlsProps {
  mode: 'display' | 'edit';
  currentEditMode: EditMode;
  theme: FretboardTheme;
  onEditModeChange?: (mode: EditMode) => void;
  onClear: () => void;
  onSave: () => void;
  setCurrentEditMode: (mode: EditMode) => void;
  setBarreStartPosition: (
    position: { fret: number; string: number } | null
  ) => void;
}

export const EditModeControls: React.FC<EditModeControlsProps> = ({
  mode,
  currentEditMode,
  theme,
  onEditModeChange,
  onClear,
  onSave,
  setCurrentEditMode,
  setBarreStartPosition,
}) => {
  if (mode !== 'edit') return null;

  const handleModeChange = (modeOption: EditMode) => {
    setCurrentEditMode(modeOption);
    setBarreStartPosition(null);
    onEditModeChange?.(modeOption);
  };

  return (
    <>
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
            onPress={() => handleModeChange(modeOption)}
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: '#ef4444' }]}
          onPress={onClear}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.dotActiveColor }]}
          onPress={onSave}
        >
          <Text style={styles.buttonText}>Save Chord</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
});
