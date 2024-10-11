import React from 'react';
import { Pressable } from 'react-native';
import { HomeBtmView, ScrollViewContainer, WordContainer, WordView, WordText } from '../screens/OcrCameraScreen/OcrScreen.style';
import { FadeInDown } from 'react-native-reanimated';

export const ResultWordList = ({ resultText, selectedIndices, selectedWords }) => {
  if (!resultText) return null;

  return resultText.split(/\s+/).length > 9 ? (
    <HomeBtmView>
      <ScrollViewContainer>
        <WordContainer>
          {resultText.split(/\s+/).map((result: any, index: any) => (
            <WordView key={index} isSelected={selectedIndices.includes(index)} entering={FadeInDown.duration(1000).delay(0)}>
              <Pressable onPress={() => selectedWords(result, index)}>
                <WordText>{result}</WordText>
              </Pressable>
            </WordView>
          ))}
        </WordContainer>
      </ScrollViewContainer>
    </HomeBtmView>
  ) : (
    <HomeBtmView>
      {resultText.split(/\s+/).map((result: any, index: any) => (
        <WordView key={index} isSelected={selectedIndices.includes(index)} entering={FadeInDown.duration(1000).delay(0)}>
          <Pressable onPress={() => selectedWords(result, index)}>
            <WordText>{result}</WordText>
          </Pressable>
        </WordView>
      ))}
    </HomeBtmView>
  );
};