import React from "react";
import { View, Text } from "react-native";
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
};

export const LanguageView: React.FC<LanguageViewProps> = ({ wordsList, loading }) => {
  const groupedWords: Record<string, [string, string][]> = {};

  wordsList.forEach(([originalWord, translatedWord]) => {
    const firstLetter = originalWord.charAt(0).toUpperCase();
    if (!groupedWords[firstLetter]) {
      groupedWords[firstLetter] = [];
    }
    groupedWords[firstLetter].push([originalWord, translatedWord]);
  });

  return (
    <>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <LanguageScrollView showsVerticalScrollIndicator={false}>
          {Object.keys(groupedWords).map((letter) => (
            <View key={letter}>
              {/* Wrap letter in a Text component */}
              <LanguageInsideAlphabetView>
                <LanguageInsideAlphabetText>
                  <Text>{letter}</Text>
                </LanguageInsideAlphabetText>
              </LanguageInsideAlphabetView>

              {groupedWords[letter].map(
                ([originalWord, translatedWord], index) => (
                  <LanguageInsideView key={index}>
                    <LanguageInsiderView>
                      {/* Wrap text in Text components */}
                      <LanguageInsiderText>
                        <Text>{originalWord}</Text>
                      </LanguageInsiderText>
                      <LanguageInsiderText>
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
