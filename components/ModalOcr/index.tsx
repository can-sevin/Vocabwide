import React from "react";
import { Modal } from "react-native";
import {
  ModalContainer,
  ModalContent,
  ModalText,
  ModalContentInner,
  SaveButton,
  SaveButtonText,
  CancelButton,
  CancelButtonText,
} from "./style";

type ModalOcrProps = {
  visible: boolean;
  selectedWord: string | null;
  translatedWord: string | null;
  onSave: () => void;
  onCancel: () => void;
};

export const ModalOcr: React.FC<ModalOcrProps> = ({
  visible,
  selectedWord,
  translatedWord,
  onSave,
  onCancel,
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onCancel}
  >
    <ModalContainer>
      <ModalContent>
        <ModalText>{`${selectedWord} -> ${translatedWord}`}</ModalText>
        <ModalContentInner>
          <SaveButton onPress={onSave}>
            <SaveButtonText>Save</SaveButtonText>
          </SaveButton>
          <CancelButton onPress={onCancel}>
            <CancelButtonText>Cancel</CancelButtonText>
          </CancelButton>
        </ModalContentInner>
      </ModalContent>
    </ModalContainer>
  </Modal>
);

export default ModalOcr;
