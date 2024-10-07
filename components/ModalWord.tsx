import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../config";
import {
  ButtonContainer,
  CancelButton,
  CancelButtonText,
  ModalContainer,
  ModalContent,
  ModalText,
  SaveButton,
  SaveButtonText,
} from "./styles/ModalWord.style";

type ModalWordProps = {
  modalVisible: boolean;
  selectedWord: string | null;
  translatedWord: string | null;
  onSave: () => void;
  onCancel: () => void;
};

export const ModalWord: React.FC<ModalWordProps> = ({
  modalVisible,
  selectedWord,
  translatedWord,
  onSave,
  onCancel,
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
          <ModalText>
            {`${selectedWord ?? ""} -> ${translatedWord ?? ""}`}
          </ModalText>
          <ButtonContainer>
            <SaveButton onPress={onSave}>
              <SaveButtonText>Save</SaveButtonText>
            </SaveButton>
            <CancelButton onPress={onCancel}>
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};
