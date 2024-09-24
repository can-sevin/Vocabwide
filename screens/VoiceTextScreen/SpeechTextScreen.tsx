import React, { useEffect, useRef, useState } from "react";
import { Platform, TouchableOpacity, ImageBackground, Pressable, Modal } from "react-native";
import { Images, auth, database } from "../../config";
import { ref, get, set } from 'firebase/database'; // Import Firebase functions
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechVolumeChangeEvent,
} from "@react-native-voice/voice";
import LottieView from 'lottie-react-native';
import { FadeInDown } from 'react-native-reanimated';
import translate from 'translate-google-api'; // Import the translation API
import { BackIcon, CancelButton, CancelButtonText, Container, DescriptionText, HeaderText, LottieAnimation, MicButton, MicIcon, ModalContainer, ModalContent, ModalInnerView, ModalText, ResultsContainer, SaveButton, SaveButtonText, ScrollViewContainer, WordText, WordView } from "./SpeechTextScreen.style";

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
      <ModalContainer>
      <ModalContent>
        <ModalText>{`${selectedWord} -> ${translatedWord}`}</ModalText>
        <ModalInnerView>
        <SaveButton onPress={saveWordPair}>
          <SaveButtonText>Save</SaveButtonText>
        </SaveButton>
      
        <CancelButton onPress={() => setModalVisible(false)}>
          <CancelButtonText>Cancel</CancelButtonText>
        </CancelButton>
        </ModalInnerView>
      </ModalContent>
    </ModalContainer>
  </Modal>
  )}
    
  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }} resizeMode="cover">
    <Container entering={FadeInDown.duration(2000).delay(100)}>
    <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress={() => navigation.goBack()}>
      <BackIcon source={Images.back_icon} />  
    </TouchableOpacity>
    <HeaderText>Add words by voice</HeaderText>
    <ModalSpeech/>
    <DescriptionText>
      {end
        ? "Voice recognition is over, please press the icon"
        : "Press the button to start or stop speaking."}
    </DescriptionText>

    <MicButton
      onPress={started ? _destroyRecognizer : _startRecognizing}
    >
      <MicIcon source={Images.mic_icon} />
    </MicButton>

    <ResultsContainer>
    {started && !end && (
      <LottieAnimation
        source={Images.lottie_recognition}
        autoPlay
        loop
      />
    )}

    {!started && !end && (
      <DescriptionText>Your Words came here you can add words into your vocabulary list by press.</DescriptionText>
    )}

    {results.length > 9 ? (
      <ScrollViewContainer>
        {results.map((result, index) => (
          end && (
          <WordView
            key={index}
            selected={selectedIndices.includes(index)} // Pass the isSelected prop
            entering={FadeInDown.duration(1000).delay(0)}
          >
                  <Pressable key={`result-${index}`} onPress={() => selectedWords(result, index)}>
            <WordText>{result}</WordText>
            </Pressable>
          </WordView>
          )
        ))}
      </ScrollViewContainer>
    ) : (
      results.map((result, index) => (
        end && (
          <WordView
            key={index}
            selected={selectedIndices.includes(index)} // Pass the isSelected prop
            entering={FadeInDown.duration(1000).delay(0)}
          >
          <Pressable key={`result-${index}`} onPress={() => selectedWords(result, index)}>
          <WordText>{result}</WordText>
          </Pressable>
        </WordView>
        )
      ))
    )}
    </ResultsContainer>
    </Container>
    </ImageBackground>
    );
  };
   
export default SpeechTextScreen;