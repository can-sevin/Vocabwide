import { useEffect, useState } from "react";
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";
import { Flags, auth, database } from "../config";
import { fetchTransitions } from "../config/gpt";
import { ref, get, set } from "firebase/database";
import { Platform } from "react-native";

export const useSpeechRecognition = (params: {
  main: string;
  target: string;
}) => {
  const { main, target } = params;
  const [recognized, setRecognized] = useState("");
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState("");
  const [started, setStarted] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [partialResults, setPartialResults] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translatedWord, setTranslatedWord] = useState<string | null>(null);

  useEffect(() => {
    const onSpeechStart = (e: any) => {
      setStarted("√");
    };

    const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
      setRecognized("√");
    };

    const onSpeechEnd = (e: any) => {
      setEnd("√");
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
      setError(JSON.stringify(e.error));
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
      const words = e.value ? e.value[0].split(" ") : [];
      setResults(words);
    };

    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      const words = e.value ? e.value[0].split(" ") : [];
      setPartialResults(words);
    };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

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
      await Voice.start(Flags[main].speechRecognitionLocale);
      if (Platform.OS === "ios") {
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

      // GPT tabanlı çeviri çağrısı
      const translations = await fetchTransitions([result], main, target, setLoading);

      if (translations.length > 0) {
        const translationText = translations[0].translations.join(", ");
        setSelectedWord(result);
        setTranslatedWord(translationText);
        setModalVisible(true);
      } else {
        console.error("No translations found");
      }

      setLoading(false);
    } catch (error) {
      console.error("Translation Error:", error);
      setLoading(false);
    }
  };

  const saveWordPair = async (
    selectedWord: string | null,
    translatedWord: string | null,
    main: any,
    target: any
  ) => {
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
    const originalWordsRef = ref(
      database,
      `users/${userId}/${main}${target}originalWords`
    );
    const translatedWordsRef = ref(
      database,
      `users/${userId}/${main}${target}translatedWords`
    );

    try {
      setLoading(true);

      const originalSnapshot = await get(originalWordsRef);
      const translatedSnapshot = await get(translatedWordsRef);

      let currentOriginalWords = originalSnapshot.exists()
        ? originalSnapshot.val()
        : [];
      let currentTranslatedWords = translatedSnapshot.exists()
        ? translatedSnapshot.val()
        : [];

      if (!Array.isArray(currentOriginalWords)) currentOriginalWords = [];
      if (!Array.isArray(currentTranslatedWords)) currentTranslatedWords = [];

      if (currentOriginalWords.includes(selectedWord)) {
        console.log("The word already exists in the originalWords list.");
        setModalVisible(false);
        setLoading(false);
        return;
      }

      const updatedOriginalWords = [...currentOriginalWords, selectedWord];
      const updatedTranslatedWords = [
        ...currentTranslatedWords,
        translatedWord,
      ];

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

  return {
    recognized,
    pitch,
    error,
    started,
    results,
    partialResults,
    selectedIndices,
    end,
    loading,
    modalVisible,
    selectedWord,
    translatedWord,
    _startRecognizing,
    _destroyRecognizer,
    selectedWords,
    saveWordPair,
    setModalVisible,
  };
};