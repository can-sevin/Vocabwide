import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Image, Text, View, ScrollView, Platform, TouchableOpacity, ImageBackground, Pressable, Modal } from "react-native";
import { Colors, Images, auth, database } from "../../config";
import { ref, get, set } from 'firebase/database'; // Import Firebase functions
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechVolumeChangeEvent,
} from "@react-native-voice/voice";
import LottieView from 'lottie-react-native';
import { HomeBtmView } from "../../styles/HomeScreen";
import Animated, { FadeInDown } from 'react-native-reanimated';
import translate from 'translate-google-api'; // Import the translation API

export const SpeechTextScreen = ({ navigation }) => {
  const [recognized, setRecognized] = useState("");
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState("");
  const [started, setStarted] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [partialResults, setPartialResults] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [end, setEnd] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translatedWord, setTranslatedWord] = useState<string | null>(null);
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    const onSpeechStart = (e: any) => {
      console.log("onSpeechStart: ", e);
      animationRef.current?.play();
      setStarted("√");
    };

    const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
      console.log("onSpeechRecognized: ", e);
      setRecognized("√");
    };

    const onSpeechEnd = (e: any) => {
      console.log("onSpeechEnd: ", e);
      animationRef.current?.pause();
      setEnd("√");
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
      console.log("onSpeechError: ", e);
      animationRef.current?.pause();
      setError(JSON.stringify(e.error));
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
      console.log("onSpeechResults: ", e);
      animationRef.current?.pause();
      const words = e.value ? e.value[0].split(" ") : [];
      setResults(words);
    };
    
    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      console.log("onSpeechPartialResults: ", e);
      animationRef.current?.pause();
      const words = e.value ? e.value[0].split(" ") : [];
      setPartialResults(words);
    };

    const onSpeechVolumeChanged = (e: SpeechVolumeChangeEvent) => {
      console.log("onSpeechVolumeChanged: ", e);
      setPitch(e.value);
    };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const _startRecognizing = async () => {
    setRecognized("");
    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");

    try {
      await Voice.start("en-US");
      if (Platform.OS === 'ios') {
        setTimeout(() => {
          Voice.stop();
        }, 5000);
      }  
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setRecognized("");
    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");
  };

  const _pauseRecognizer = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
    setRecognized("");
    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");
  };

  const selectedWords = async (result: string, index: number) => {
    setSelectedIndices((prevIndices) => {
      if (prevIndices.includes(index)) {
        return prevIndices.filter((i) => i !== index);
      } else {
        return [...prevIndices, index];
      }
    });
  
    try {
      const translation = await translate(result, { to: 'tr' }); // Translate to Turkish
      setSelectedWord(result);
      setTranslatedWord(translation[0]); // Store the translation
      setModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  const saveWordPair = async () => {

    if (!selectedWord || !translatedWord) {
      console.log("No word selected or translation is missing.");
      return;
    }
  
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }
  
    const userId = currentUser.uid;
    const originalWordsRef = ref(database, `users/${userId}/originalWords`);
    const translatedWordsRef = ref(database, `users/${userId}/translatedWords`);
  
    try {
      // Fetch existing words from Firebase
      const originalSnapshot = await get(originalWordsRef);
      const translatedSnapshot = await get(translatedWordsRef);
  
      let currentOriginalWords = originalSnapshot.exists() ? originalSnapshot.val() : [];
      let currentTranslatedWords = translatedSnapshot.exists() ? translatedSnapshot.val() : [];
  
      // Ensure the words are arrays
      if (!Array.isArray(currentOriginalWords)) currentOriginalWords = [];
      if (!Array.isArray(currentTranslatedWords)) currentTranslatedWords = [];
  
      // Check if the word already exists to avoid duplication
      if (currentOriginalWords.includes(selectedWord)) {
        console.log("The word already exists in the originalWords list.");
        setModalVisible(false);
        return;
      }
  
      // Add the new words to the arrays
      const updatedOriginalWords = [...currentOriginalWords, selectedWord];
      const updatedTranslatedWords = [...currentTranslatedWords, translatedWord];
  
      // Save to Firebase
      await set(originalWordsRef, updatedOriginalWords);
      await set(translatedWordsRef, updatedTranslatedWords);
  
      console.log("Saved successfully:", selectedWord, "->", translatedWord);
  
      // Close the modal and reset states
      setModalVisible(false);
      setSelectedWord(null);
      setTranslatedWord(null);
    } catch (error) {
      console.error("Error saving words to Firebase:", error);
    }
  };

  const ModalSpeech = () => {
    return(
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
      <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {/* Display the selected word and its translation */}
        <Text style={styles.modalText}>{`${selectedWord} -> ${translatedWord}`}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '80%'}}>
        <TouchableOpacity style={styles.saveButton} onPress={saveWordPair}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      
        {/* Cancel button to close the modal */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
  )}
    
  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }} resizeMode="cover">
    <Animated.View style={styles.container} entering={FadeInDown.duration(2000).delay(100)}>
    <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress={() => navigation.goBack()}>
      <Image style={{width: 36, height: 36, marginLeft: 12}} source={Images.back_icon} />  
    </TouchableOpacity>
    <Text style={styles.header_text}>Add words by voice</Text>
    <ModalSpeech/>
    <Text style={styles.desc_text}>
      {end
        ? "Voice recognition is over, please press the icon"
        : "Press the button to start or stop speaking."}
    </Text>

    <TouchableOpacity
      style={styles.mic_button}
      onPress={started ? _destroyRecognizer : _startRecognizing}
    >
      <Image style={styles.mic_icon} source={Images.mic_icon} />
    </TouchableOpacity>

    <HomeBtmView
      style={[
        styles.resultsContainer,
      ]}
    >
    {started && !end && (
      <LottieView
        source={Images.lottie_recognition}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />
    )}

    {!started && !end && (
      <Text style={styles.desc_text}>Your Words came here you can add words into your vocabulary list by press.</Text>
    )}

    {results.length > 9 ? (
      <ScrollView style={styles.scrollView}>
        {results.map((result, index) => (
          end && (
          <Animated.View style={[styles.word_view, selectedIndices.includes(index) && styles.selected_word_view]} entering={FadeInDown.duration(1000).delay(0)}>
            <Pressable key={`result-${index}`} onPress={() => selectedWords(result, index)}>
            <Text style={styles.word_text}>{result}</Text>
            </Pressable>
          </Animated.View>
          )
        ))}
      </ScrollView>
    ) : (
      results.map((result, index) => (
        end && (
        <Animated.View style={[styles.word_view, selectedIndices.includes(index) && styles.selected_word_view]} entering={FadeInDown.duration(1000).delay(0)}>
          <Pressable key={`result-${index}`} onPress={() => selectedWords(result, index)}>
          <Text style={styles.word_text}>{result}</Text>
          </Pressable>
        </Animated.View>
        )
      ))
    )}
    </HomeBtmView>
    </Animated.View>
    </ImageBackground>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: 32,
      justifyContent: "space-between",
    },
    back_button: {
      fontSize: 32,
      marginHorizontal: 24,
      alignSelf: "flex-start",
      textAlign: "center",
      color: "#fff",
      fontFamily: "Helvetica-Bold",
    },
    header_text: {
      fontSize: 32,
      alignSelf: "center",
      textAlign: "center",
      color: "#fff",
      fontFamily: "Helvetica-Bold",
    },
    resultsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',  
      height: 280,
      justifyContent: 'space-evenly',
      width: '100%',
    },  
    desc_text: {
      fontSize: 18,
      alignSelf: "center",
      textAlign: "center",
      color: "#fff",
      fontFamily: "Helvetica-Medium",
      marginVertical: 5,
      marginTop: 52,
      marginHorizontal: 28,
    },
    word_view: {
      width: '20%',
      height: 48,
      borderRadius: 20,
      backgroundColor: Colors.LighterGray3,
      justifyContent: "center",
      marginVertical: 12,
      marginHorizontal: 8
    },
    word_text: {
      color: "#fff",
      fontSize: 12,
      textAlign: "center",
      fontFamily: "Helvetica-Medium",
    },
    mic_button: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 80,
    },
    lottieAnimation: {
      width: 160,
      height: 320,
      alignSelf: "center",
    },  
    mic_icon: {
      width: 80,
      height: 80,
    },
    btn_next: {
      height: 48,
      width: 160,
      backgroundColor: Colors.liliac,
      borderRadius: 12,
      marginTop: 16,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
    },
    scrollView: {
      flex: 1,
      width: '100%',
      backgroundColor: Colors.whiteLight,
      height: 280,
      borderRadius: 24,
    },
    selected_word_view: {
      backgroundColor: Colors.main_light_yellow,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: "white",
      borderRadius: 12,
      alignItems: "center",
    },
    modalText: {
      fontSize: 20,
      marginBottom: 20,
      fontFamily: 'Helvetica-Medium',
    },
    saveButton: {
      backgroundColor: Colors.main_yellow,
      padding: 12,
      borderRadius: 8,
    },
    saveButtonText: {
      color: "white",
      fontFamily: 'Helvetica-Medium',
    },
    cancelButton: {
      backgroundColor: "red",
      padding: 12,
      borderRadius: 8,
    },
    cancelButtonText: {
      color: "white",
      fontFamily: 'Helvetica-Medium',
    },    
  });
  
export default SpeechTextScreen;