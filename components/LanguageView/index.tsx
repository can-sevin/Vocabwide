import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
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
import { deleteWordsFromFirebase } from "../../firebase";

type LanguageViewProps = {
  wordsList: [string, string][];
  loading: boolean;
  mainFlag: any;
  targetFlag: any;
  setLoading: any;
  uid: string;
  setWordsList: React.Dispatch<React.SetStateAction<[string, string][]>>;
  onWordDeleted: () => void;
};

export const LanguageView: React.FC<LanguageViewProps> = ({
  wordsList,
  loading,
  mainFlag,
  targetFlag,
  setLoading,
  uid,
  setWordsList,
  onWordDeleted,
}) => {
  const groupedWords: Record<string, [string, string][]> = {};
  wordsList.forEach(([originalWord, translatedWord]) => {
    const firstLetter = originalWord.charAt(0).toUpperCase();
    if (!groupedWords[firstLetter]) {
      groupedWords[firstLetter] = [];
    }
    groupedWords[firstLetter].push([originalWord, translatedWord]);
  });
  const screenHeight = Dimensions.get("screen").height;

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

  const handleDeleteWord = async (
    originalWord: string,
    translatedWord: string,
    uid: string
  ) => {
    try {
      await deleteWordsFromFirebase(
        uid,
        originalWord,
        translatedWord,
        mainFlag,
        targetFlag
      );
      console.log(`Successfully deleted: ${originalWord}`);

      // setWordsList((prevList) =>
      //   prevList.filter(
      //     ([word]) => word.toLowerCase() !== originalWord.toLowerCase()
      //   )
      // );
    } catch (error) {
      console.error(`Error deleting word: ${originalWord}`, error);
    }
  };

  const handleDeleteGroup = (letter: string, translatedWord: string) => {
    // setWordsList((prevList) =>
    //   prevList.filter(([word]) => word[0].toUpperCase() !== letter)
    // );
  };

  const renderWordItem = (
    originalWord: string,
    translatedWord: string,
    letter: string,
    index: number,
    onEmptyGroup: () => void
  ) => {
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const height = useSharedValue(screenHeight / 30);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
      height: height.value,
    }));

    const backgroundStyle = useAnimatedStyle(() => ({
      justifyContent: translateX.value > 0 ? "flex-start" : "flex-end",
      paddingHorizontal: 16,
    }));

    const handleGesture = (event: PanGestureHandlerGestureEvent) => {
      const { translationX } = event.nativeEvent;
      translateX.value = translationX;
    };

    const handleGestureEnd = (event: PanGestureHandlerGestureEvent) => {
      const { translationX } = event.nativeEvent;

      if (Math.abs(translationX) > 100) {
        translateX.value = withTiming(
          translationX > 0 ? 500 : -500,
          { duration: 300 },
          () => {
            opacity.value = withTiming(0, { duration: 300 });
            height.value = withTiming(0, { duration: 300 }, () => {
              runOnJS(handleDeleteWord)(originalWord, translatedWord, uid);

              runOnJS(onWordDeleted)();

              if (groupedWords[letter].length === 1) {
                runOnJS(onEmptyGroup)();
              }
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
        <View style={{ position: "relative" }}>
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "red",
                flexDirection: "row",
              },
              backgroundStyle,
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
                fontWeight: "bold",
              }}
            >
              X
            </Text>
          </Animated.View>
          <PanGestureHandler
            onGestureEvent={handleGesture}
            onEnded={handleGestureEnd}
          >
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
        </View>
      </Animated.View>
    );
  };

  const renderLetterView = (
    letter: string,
    words: [string, string][],
    index: number
  ) => {
    const baseHeight = screenHeight / 14;
    const additionalHeight = (screenHeight / 28) * (words.length - 1);
    const totalHeight = baseHeight + additionalHeight;

    const opacity = useSharedValue(1);
    const height = useSharedValue(totalHeight);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      height: height.value,
    }));

    const onEmptyGroup = () => {
      opacity.value = withTiming(0, { duration: 300 });
      height.value = withTiming(0, { duration: 300 });
    };

    return (
      <Animated.View
        key={letter}
        style={[animatedStyle, { overflow: "hidden" }]}
      >
        <LanguageInsideAlphabetView>
          <LanguageInsideAlphabetText>
            <Text>{letter}</Text>
          </LanguageInsideAlphabetText>
        </LanguageInsideAlphabetView>
        {words.map(([originalWord, translatedWord], idx) => (
          <LanguageInsideView key={`${originalWord}-${idx}`}>
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
        ))}
      </Animated.View>
    );
  };
  return (
    <>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <LanguageScrollView>
          {Object.entries(groupedWords).map(([letter, words], index) =>
            renderLetterView(letter, words, index)
          )}
        </LanguageScrollView>
      )}
    </>
  );
};

export default LanguageView;
