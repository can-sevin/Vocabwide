import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import {
  ButtonContainer,
  CancelButton,
  CancelButtonText,
  ModalContainer,
  ModalContent,
  ModalText,
} from "./style";
import { Flags } from "../../config";
import { LoadingIndicator } from "../LoadingIndicator";

type FlagKey = keyof typeof Flags;

type ModalFlagProps = {
  modalVisible: boolean;
  onSave: (selectedFlag: FlagKey) => void;
  onCancel: () => void;
  excludeFlag: FlagKey;
  loading: boolean;
};

export const ModalFlag: React.FC<ModalFlagProps> = ({
  modalVisible,
  onSave,
  onCancel,
  excludeFlag,
  loading,
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredFlags = Object.entries(Flags).filter(
    ([languageKey, flagObject]) =>
      languageKey !== excludeFlag &&
      (flagObject.language.toLowerCase().includes(searchText.toLowerCase()) ||
        flagObject.flag.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <ModalContainer>
        <ModalContent>
          {loading ? (
            <LoadingIndicator />
          ) : (
            <>
              <ModalText>Select a Flag</ModalText>
              <TextInput
                style={styles.searchBar}
                placeholder="Search for a flag..."
                value={searchText}
                onChangeText={setSearchText}
              />
              <ScrollView style={{ maxHeight: 200 }}>
                {filteredFlags.map(([languageKey, flagObject]) => (
                  <TouchableOpacity
                    key={languageKey}
                    style={styles.flagItem}
                    onPress={() => onSave(languageKey as FlagKey)}
                  >
                    <Text style={styles.flagText}>
                      {flagObject.flag} - {flagObject.language}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ButtonContainer>
                <CancelButton onPress={onCancel}>
                  <CancelButtonText>Cancel</CancelButtonText>
                </CancelButton>
              </ButtonContainer>
            </>
          )}
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  flagItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  flagText: {
    fontSize: 18,
    color: "#333",
  },
});