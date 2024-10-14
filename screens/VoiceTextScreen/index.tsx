import React from "react";
import {
  TouchableOpacity,
  ImageBackground,
  Pressable,
  View,
  SafeAreaView,
} from "react-native";
import { FadeInDown } from "react-native-reanimated";
import { Images } from "../../config";
import {
  BackIcon,
  Container,
  DescriptionText,
  HeaderText,
  LoadingOverlay,
  LottieAnimation,
  MicButton,
  MicIcon,
  ResultsContainer,
  ScrollViewContainer,
  TransparentOverlay,
  WordContainer,
  WordText,
  WordView,
} from "./style";
import { LoadingIndicator } from "../../components";
import ModalOcr from "../../components/ModalOcr";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";

export const SpeechTextScreen = ({ navigation, route }) => {
  const { main, target } = route.params;

  const {
    started,
    results,
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
  } = useSpeechRecognition({ main, target });

  const LoadingComponent = () => (
    <LoadingOverlay>
      <TransparentOverlay>
        <LoadingIndicator />
      </TransparentOverlay>
    </LoadingOverlay>
  );

  return (
    <ImageBackground
      source={Images.background}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
      <Container entering={FadeInDown.duration(2000).delay(100)}>
        {loading ? (
          <LoadingComponent />
        ) : (
          <ModalOcr
            visible={modalVisible}
            selectedWord={selectedWord}
            translatedWord={translatedWord}
            onSave={() =>
              saveWordPair(selectedWord, translatedWord, main, target)
            }
            onCancel={() => setModalVisible(false)}
          />
        )}
        <TouchableOpacity
          style={{ alignSelf: "flex-start" }}
          onPress={() => navigation.goBack()}
        >
          <BackIcon source={Images.back_icon} />
        </TouchableOpacity>
        <HeaderText>Add words by voice</HeaderText>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <DescriptionText>
            {end
              ? "Voice recognition is over, please press the icon"
              : "Press the button to start or stop speaking."}
          </DescriptionText>

          <MicButton onPress={started ? _destroyRecognizer : _startRecognizing}>
            <MicIcon source={Images.mic_icon} />
          </MicButton>
        </View>
        <ResultsContainer>
          {started && !end && (
            <LottieAnimation source={Images.lottie_recognition} autoPlay loop />
          )}

          {!started && !end && (
            <DescriptionText>
              Your Words came here you can add words into your vocabulary list
              by press.
            </DescriptionText>
          )}

          {results.length > 9 ? (
            <ScrollViewContainer>
              <WordContainer>
                {results.map(
                  (result, index) =>
                    end && (
                      <WordView
                        key={index}
                        selected={selectedIndices.includes(index)}
                        entering={FadeInDown.duration(1000).delay(0)}
                      >
                        <Pressable onPress={() => selectedWords(result, index)}>
                          <WordText>{result}</WordText>
                        </Pressable>
                      </WordView>
                    )
                )}
              </WordContainer>
            </ScrollViewContainer>
          ) : (
            results.map(
              (result, index) =>
                end && (
                  <WordView
                    key={index}
                    selected={selectedIndices.includes(index)}
                    entering={FadeInDown.duration(1000).delay(0)}
                  >
                    <Pressable onPress={() => selectedWords(result, index)}>
                      <WordText>{result}</WordText>
                    </Pressable>
                  </WordView>
                )
            )
          )}
        </ResultsContainer>
      </Container>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SpeechTextScreen;
