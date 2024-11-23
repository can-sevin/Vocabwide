import { ref, get, set } from "firebase/database";
import { database, Flags } from "../config";
import * as ImageManipulator from "expo-image-manipulator";
import textRecognition, {
  TextRecognitionScript,
} from "@react-native-ml-kit/text-recognition";
import { fetchTransitions } from "../config/gpt";
import { SetStateAction } from "react";

export const selectedWords = async (
  word: string,
  index: number,
  mainFlag: any,
  targetFlag: any,
  setSelectedWord: {
    (value: SetStateAction<string | null>): void;
    (arg0: any): void;
  },
  setTranslatedWord: {
    (value: SetStateAction<string | null>): void;
    (arg0: any): void;
  },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  setModalVisible: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  }
) => {
  try {
    setLoading(true);

    // GPT üzerinden çeviri al
    const translations = await fetchTransitions([word], mainFlag, targetFlag, setLoading);

    if (translations.length > 0) {
      setSelectedWord(word);
      setTranslatedWord(translations[0].translations.join(", "));
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

export const saveWordPair = async (
  selectedWord: string | null,
  translatedWord: string | null,
  mainFlag: any,
  targetFlag: any,
  userId: string | undefined,
  resultText: string | null,
  setModalVisible: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  },
  setSelectedWord: {
    (value: SetStateAction<string | null>): void;
    (arg0: null): void;
  },
  setTranslatedWord: {
    (value: SetStateAction<string | null>): void;
    (arg0: null): void;
  },
  setSelectedIndices: {
    (value: SetStateAction<number[]>): void;
    (arg0: (prev: any) => any[]): void;
  }
) => {
  const originalWordsRef = ref(
    database,
    `users/${userId}/${mainFlag}${targetFlag}originalWords`
  );
  const translatedWordsRef = ref(
    database,
    `users/${userId}/${mainFlag}${targetFlag}translatedWords`
  );

  try {
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

    if (!currentOriginalWords.includes(selectedWord)) {
      const updatedOriginalWords = [...currentOriginalWords, selectedWord];
      const updatedTranslatedWords = [
        ...currentTranslatedWords,
        translatedWord,
      ];

      await set(originalWordsRef, updatedOriginalWords);
      await set(translatedWordsRef, updatedTranslatedWords);

      const resultIndex = resultText.split(/\s+/).indexOf(selectedWord);
      if (resultIndex !== -1) {
        setSelectedIndices((prev: any) => [...prev, resultIndex]);
      }

      setModalVisible(false);
      setSelectedWord(null);
      setTranslatedWord(null);
    }
  } catch (error) {
    console.error("Error saving words to Firebase:", error);
  }
};

export const processImage = async (
  uri: string,
  mainFlag: string | number,
  setLoading: (arg0: boolean) => void,
  setResultText: { (text: string): void; (arg0: string): void }
) => {
  try {
    setLoading(true);
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    const family = Flags[mainFlag].family;

    let script: TextRecognitionScript | null = null;
    switch (family) {
      case "Chinese":
        script = TextRecognitionScript.CHINESE;
        break;
      case "Japanese":
        script = TextRecognitionScript.JAPANESE;
        break;
      case "Korean":
        script = TextRecognitionScript.KOREAN;
        break;
      case "Devanagari":
        script = TextRecognitionScript.DEVANAGARI;
        break;
      case "Latin":
        script = TextRecognitionScript.LATIN;
        break;
      default:
        console.error("The language family doesn't support text recognition.");
        setLoading(false);
        return;
    }

    const result = await textRecognition.recognize(
      manipulatedImage.uri,
      script
    );
    setResultText(result.text);
    setLoading(false);
  } catch (error) {
    console.error("Text recognition failed:", error);
    setLoading(false);
  }
};