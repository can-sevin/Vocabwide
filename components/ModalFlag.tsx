import React from 'react';
import { Modal, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ButtonContainer, CancelButton, CancelButtonText, ModalContainer, ModalContent, ModalText } from './styles/ModalFlag.style';
import { Flags } from '../config';

type FlagKey = keyof typeof Flags;

type ModalFlagProps = {
  modalVisible: boolean;
  onSave: (selectedFlag: FlagKey) => void;
  onCancel: () => void;
  excludeFlag: FlagKey;
};

export const ModalFlag: React.FC<ModalFlagProps> = ({ 
  modalVisible, 
  onSave, 
  onCancel, 
  excludeFlag
}) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <ModalContainer>
        <ModalContent>
          <ModalText>Select a Flag</ModalText>
          <ScrollView style={{ maxHeight: 200 }}>
            {Object.entries(Flags)
              .filter(([languageKey]) => languageKey !== excludeFlag)
              .map(([languageKey, flagObject]) => (
                <TouchableOpacity 
                  key={languageKey} 
                  style={styles.flagItem}
                  onPress={() => onSave(languageKey as FlagKey)}
                >
                  <Text style={styles.flagText}>{flagObject.flag} - {flagObject.language}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
          <ButtonContainer>
            <CancelButton onPress={onCancel}>
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flagItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  flagText: {
    fontSize: 18,
    color: '#333',
  },
});