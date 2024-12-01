import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const TutorialModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Tutorial</Text>
          <Text style={styles.description}>
            Welcome to Vocabwide! With this app, expanding your vocabulary has
            never been easier. {"\n\n"}
            To add words, simply choose one of the options at the bottom of the
            screen (Voice, Input, or Camera). {"\n"}
            Using these methods, Vocabwide will translate your words from any
            language to your desired target language. {"\n\n"}
            Once you’ve added words, they’ll appear in your word list. {"\n"}
            After your word list reaches 10 or more entries, we’ll create an
            AI-powered quiz to test how well you remember them. 🧠✨ {"\n\n"}
            To start, make sure to select the language you want to learn as the
            first option. {"\n"}
            The second option should be your native language or the one you’re
            most comfortable with. {"\n\n"}
            To delete a word, simply swipe it left or right in your word list.
            😊 {"\n\n"}
            Get ready to level up your vocabulary with Vocabwide! 🚀
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10,
    width: "50%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default TutorialModal;