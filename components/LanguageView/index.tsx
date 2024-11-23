import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech"; // Speech modülü eklendi
import {
  LanguageScrollView,
  LanguageInsideAlphabetView,
  LanguageInsideAlphabetText,
  LanguageInsideView,
  LanguageInsiderView,
  LanguageInsiderText,
} from "./style";
import { LoadingIndicator } from "../LoadingIndicator";

type LanguageViewProps = {
  wordsList: [string, string][];
  loading: boolean;
  mainFlag: any;
};

export const LanguageView: React.FC<LanguageViewProps> = ({
  wordsList,
  loading,
  mainFlag,
}) => {
  const groupedWords: Record<string, [string, string][]> = {};

  wordsList.forEach(([originalWord, translatedWord]) => {
    const firstLetter = originalWord.charAt(0).toUpperCase();
    if (!groupedWords[firstLetter]) {
      groupedWords[firstLetter] = [];
    }
    groupedWords[firstLetter].push([originalWord, translatedWord]);
  });

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

  return (
    <>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <LanguageScrollView showsVerticalScrollIndicator={false}>
          {Object.keys(groupedWords).map((letter) => (
            <View key={letter}>
              <LanguageInsideAlphabetView>
                <LanguageInsideAlphabetText>
                  <Text>{letter}</Text>
                </LanguageInsideAlphabetText>
              </LanguageInsideAlphabetView>

              {groupedWords[letter].map(
                ([originalWord, translatedWord], index) => (
                  <LanguageInsideView key={index}>
                    <LanguageInsiderView>
                      <LanguageInsiderText
                        style={{ fontSize: getFontSize(originalWord) }}
                      >
                        <Text>{originalWord}</Text>
                        <TouchableOpacity
                          onPress={() => handleSpeak(originalWord)}
                        >
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
                )
              )}
            </View>
          ))}
        </LanguageScrollView>
      )}
    </>
  );
};

export default LanguageView;