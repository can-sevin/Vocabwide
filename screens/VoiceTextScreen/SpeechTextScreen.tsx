import React, { useEffect, useRef, useState } from "react";
import { Platform, TouchableOpacity, ImageBackground, Pressable } from "react-native";
import { Images, auth, database } from "../../config";
import { ref, get, set } from 'firebase/database';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechVolumeChangeEvent,
} from "@react-native-voice/voice";
import LottieView from 'lottie-react-native';
import { FadeInDown } from 'react-native-reanimated';
import translate from 'translate-google-api';
import { BackIcon, Container, DescriptionText, HeaderText, LottieAnimation, MicButton, MicIcon, ResultsContainer, ScrollViewContainer, WordText, WordView } from "./SpeechTextScreen.style";
import { LoadingIndicator } from "../../components";
import ModalOcr from '../../components/ModalOcr';

export const SpeechTextScreen = ({ navigation, route }) => {
  const mainFlag = route.params.main;
  const targetFlag = route.params.target;
  const [recognized, setRecognized] = useState("");
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState("");
  const [started, setStarted] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [partialResults, setPartialResults] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [end, setEnd] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translatedWord, setTranslatedWord] = useState<string | null>(null);
  const animationRef = useRef<LottieView>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onSpeechStart = (e: any) => {
      animationRef.current?.play();
      setStarted("√");
    };

    const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
      setRecognized("√");
    };

    const onSpeechEnd = (e: any) => {
      animationRef.current?.pause();
      setEnd("√");
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
      animationRef.current?.pause();
      setError(JSON.stringify(e.error));
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
      animationRef.current?.pause();
      const words = e.value ? e.value[0].split(" ") : [];
      setResults(words);
    };

    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      const words = e.value ? e.value[0].split(" ") : [];
      setPartialResults(words);
    };

    const onSpeechVolumeChanged = (e: SpeechVolumeChangeEvent) => {
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
      await Voice.start(mainFlag.speechRecognitionLocale);
        if (Platform.OS === 'ios') {
        setTimeout(() => {
          Voice.stop();
        }, 5000);
      }  
    } catch (e) {
      console.error(e);
    }
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
  
  const _destroyRecognizer = async () => {
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
      setLoading(true);
      const translation = await translate(result, { to: targetFlag });
      setSelectedWord(result);
      setTranslatedWord(translation[0]);
      setLoading(false);
      setModalVisible(true);
    } catch (error) {
      console.error("Translation Error:", error);
      setLoading(false);
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
    setLoading(true);
    const originalWordsRef = ref(database, `users/${userId}/${mainFlag}${targetFlag}originalWords`);
    const translatedWordsRef = ref(database, `users/${userId}/${mainFlag}${targetFlag}translatedWords`);

    try {
      const originalSnapshot = await get(originalWordsRef);
      const translatedSnapshot = await get(translatedWordsRef);

      let currentOriginalWords = originalSnapshot.exists() ? originalSnapshot.val() : [];
      let currentTranslatedWords = translatedSnapshot.exists() ? translatedSnapshot.val() : [];

      if (!Array.isArray(currentOriginalWords)) currentOriginalWords = [];
      if (!Array.isArray(currentTranslatedWords)) currentTranslatedWords = [];

      if (currentOriginalWords.includes(selectedWord)) {
        console.log("The word already exists in the originalWords list.");
        setModalVisible(false);
        return;
      }

      const updatedOriginalWords = [...currentOriginalWords, selectedWord];
      const updatedTranslatedWords = [...currentTranslatedWords, translatedWord];

      await set(originalWordsRef, updatedOriginalWords);
      await set(translatedWordsRef, updatedTranslatedWords);

      setLoading(false);
      setModalVisible(false);
      setSelectedWord(null);
      setTranslatedWord(null);
    } catch (error) {
      console.error("Error saving words to Firebase:", error);
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }} resizeMode="cover">
      <Container entering={FadeInDown.duration(2000).delay(100)}>
        <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress={() => navigation.goBack()}>
          <BackIcon source={Images.back_icon} />  
        </TouchableOpacity>
        <HeaderText>Add words by voice</HeaderText>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <ModalOcr 
            visible={modalVisible} 
            selectedWord={selectedWord} 
            translatedWord={translatedWord} 
            onSave={saveWordPair} 
            onCancel={() => setModalVisible(false)} 
          />
        )}
        <DescriptionText>
          {end ? "Voice recognition is over, please press the icon" : "Press the button to start or stop speaking."}
        </DescriptionText>

        <MicButton onPress={started ? _destroyRecognizer : _startRecognizing}>
          <MicIcon source={Images.mic_icon} />
        </MicButton>

        <ResultsContainer>
          {started && !end && (
            <LottieAnimation source={Images.lottie_recognition} autoPlay loop />
          )}

          {!started && !end && (
            <DescriptionText>Your Words came here you can add words into your vocabulary list by press.</DescriptionText>
          )}

          {results.length > 9 ? (
            <ScrollViewContainer>
              {results.map((result, index) => (
                end && (
                  <WordView key={index} selected={selectedIndices.includes(index)} entering={FadeInDown.duration(1000).delay(0)}>
                    <Pressable onPress={() => selectedWords(result, index)}>
                      <WordText>{result}</WordText>
                    </Pressable>
                  </WordView>
                )
              ))}
            </ScrollViewContainer>
          ) : (
            results.map((result, index) => (
              end && (
                <WordView key={index} selected={selectedIndices.includes(index)} entering={FadeInDown.duration(1000).delay(0)}>
                  <Pressable onPress={() => selectedWords(result, index)}>
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