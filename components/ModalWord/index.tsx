import React from "react";
import { Modal } from "react-native";
import {
  ButtonContainer,
  CancelButton,
  CancelButtonText,
  ModalContainer,
  ModalContent,
  ModalText,
  SaveButton,
  SaveButtonText,
} from "./style";

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
