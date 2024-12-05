import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as Speech from "expo-speech";
import {
  LanguageScrollView,
  LanguageInsideAlphabetView,
  LanguageInsideAlphabetText,
  LanguageInsideView,
  LanguageInsiderView,
  LanguageInsiderText,
} from "./style";
import { fetchPastWords } from "../../firebase";

type LanguageViewPastProps = {
  loading: boolean;
  mainFlag: string;
  targetFlag: string;
  setLoading: (loading: boolean) => void;
  uid: string;
  onWordDeleted: () => void;
};

export const LanguageViewPast: React.FC<LanguageViewPastProps> = ({
  loading,
  mainFlag,
  targetFlag,
  setLoading,
  uid,
  onWordDeleted,
}) => {
  const [pastWords, setPastWords] = useState<[string, string][]>([]);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPastWords(uid, mainFlag, targetFlag, setPastWords, (fetchedWords) => {
      setIsEmpty(fetchedWords.length === 0);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching past words:", error);
      setIsEmpty(true);
      setLoading(false);
    });
  }, [uid, mainFlag, targetFlag, setLoading]);

  const groupedWords: Record<string, [string, string][]> = {};
  pastWords.forEach(([originalWord, translatedWord]) => {
    const firstLetter = originalWord.charAt(0).toUpperCase();
    if (!groupedWords[firstLetter]) {
      groupedWords[firstLetter] = [];
    }
    groupedWords[firstLetter].push([originalWord, translatedWord]);
  });

  const screenHeight = Dimensions.get("screen").height;

  // Dinamik boyutları hesapla
  const baseHeight = screenHeight / 16; // Başlık yüksekliği
  const itemHeight = screenHeight / 30; // Her kelime için yükseklik

  const getFontSize = (text: string): number => {
    return text.length > 25 ? 12 : 16;
  };

  const handleSpeak = (text: string) => {
    Speech.speak(text, {
      language: mainFlag,
      pitch: 1.0,
      rate: 1.0,
    });
  };

  const handleDeleteWord = (originalWord: string, translatedWord: string) => {
    setPastWords((prev) =>
      prev.filter(
        ([word, translation]) =>
          word !== originalWord || translation !== translatedWord
      )
    );
    onWordDeleted();
  };

  const renderWordItem = (
    originalWord: string,
    translatedWord: string,
    letter: string,
    index: number
  ) => {
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const height = useSharedValue(itemHeight);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
      height: height.value,
    }));

    const handleGestureEnd = () => {
      if (Math.abs(translateX.value) > 100) {
        translateX.value = withTiming(
          translateX.value > 0 ? 500 : -500,
          { duration: 300 },
          () => {
            opacity.value = withTiming(0, { duration: 300 });
            height.value = withTiming(0, { duration: 300 }, () => {
              runOnJS(handleDeleteWord)(originalWord, translatedWord);
            });
          }
        );
      } else {
        translateX.value = withTiming(0, { duration: 300 });
      }
    };

    return (
      <Animated.View
        key={`${originalWord}-${index}`}
        style={[animatedStyle, { overflow: "hidden" }]}
      >
        <PanGestureHandler onEnded={handleGestureEnd}>
          <Animated.View>
            <LanguageInsideView>
              <LanguageInsiderView>
                <LanguageInsiderText
                  style={{ fontSize: getFontSize(originalWord) }}
                >
                  <Text>{originalWord}</Text>
                  <TouchableOpacity onPress={() => handleSpeak(originalWord)}>
                    <Text> 🔊</Text>
                  </TouchableOpacity>
                </LanguageInsiderText>
                <LanguageInsiderText
                  style={{ fontSize: getFontSize(translatedWord) }}
                >
                  <Text>{translatedWord}</Text>
                </LanguageInsiderText>
              </LanguageInsiderView>
            </LanguageInsideView>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    );
  };

  const renderLetterView = (
    letter: string,
    words: [string, string][],
    index: number
  ) => {
    const totalHeight = baseHeight + itemHeight * words.length;

    return (
      <Animated.View
        key={letter}
        style={{ height: totalHeight, overflow: "hidden" }}
      >
        <LanguageInsideAlphabetView>
          <LanguageInsideAlphabetText>
            <Text>{letter}</Text>
          </LanguageInsideAlphabetText>
        </LanguageInsideAlphabetView>
        {words.map(([originalWord, translatedWord], idx) =>
          renderWordItem(originalWord, translatedWord, letter, idx)
        )}
      </Animated.View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (isEmpty) {
    return <Text>No past words found!</Text>;
  }

  return (
    <LanguageScrollView>
      {Object.entries(groupedWords).map(([letter, words], index) =>
        renderLetterView(letter, words, index)
      )}
    </LanguageScrollView>
  );
};

export default LanguageViewPast;