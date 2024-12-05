import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  ImageBackground,
  Pressable,
  View,
  SafeAreaView,
  Alert,
  Platform,
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
  WordContainer,
  WordText,
  WordView,
} from "./style";
import { LoadingIndicator } from "../../components";
import ModalOcr from "../../components/ModalOcr";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
// import {
//   RewardedAd,
//   RewardedAdEventType,
//   TestIds,
// } from "react-native-google-mobile-ads";

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

  // const adUnitId =
  //   Platform.OS === "android"
  //     ? "ca-app-pub-2210071155853586/4793147397"
  //     : "ca-app-pub-2210071155853586/1045474070";

  // const [adLoaded, setAdLoaded] = useState(false);
  // const rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
  //   requestNonPersonalizedAdsOnly: true,
  // });

  // useEffect(() => {
  //   // Load the rewarded ad
  //   rewardedAd.load();

  //   const onAdLoaded = () => {
  //     setAdLoaded(true);
  //     console.log("Rewarded Ad Loaded");
  //   };

  //   const onAdEarnedReward = () => {
  //     console.log("User earned the reward");
  //     // Handle the reward logic here (e.g., save word pair)
  //     saveWordPair(selectedWord, translatedWord, main, target);
  //     setModalVisible(false);
  //   };

  //   // Ad Event Listeners
  //   const unsubscribeLoaded = rewardedAd.addAdEventListener(
  //     RewardedAdEventType.LOADED,
  //     onAdLoaded
  //   );
  //   const unsubscribeEarnedReward = rewardedAd.addAdEventListener(
  //     RewardedAdEventType.EARNED_REWARD,
  //     onAdEarnedReward
  //   );

  //   return () => {
  //     unsubscribeLoaded();
  //     unsubscribeEarnedReward();
  //   };
  // }, [selectedWord, translatedWord, saveWordPair]);

  // const showRewardedAd = () => {
  //   if (adLoaded) {
  //     rewardedAd.show();
  //   } else {
  //     Alert.alert("Ad not ready", "The ad is still loading. Please try again.");
  //     rewardedAd.load(); // Reload the ad
  //   }
  // };

  const LoadingComponent = () => (
    <LoadingOverlay>
      <LoadingIndicator />
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
                // Save the word pair without showing ads
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

            <MicButton
              onPress={started ? _destroyRecognizer : _startRecognizing}
            >
              <MicIcon source={Images.mic_icon} />
            </MicButton>
          </View>
          <ResultsContainer>
            {started && !end && (
              <LottieAnimation
                source={Images.lottie_recognition}
                autoPlay
                loop
              />
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
                          <Pressable
                            onPress={() => selectedWords(result, index)}
                          >
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