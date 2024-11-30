import React, { useRef, useState, useEffect } from "react";
import {
  Alert,
  Button,
  Pressable,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { auth, Images, Flags, Colors } from "../../config";
import {
  Container,
  CameraContainer,
  BackButtonContainer,
  BackButtonIcon,
  ControlPanel,
  ControlPanelButtons,
  LottieAnimation,
  GalleryButton,
  WordView,
  WordText,
  HomeBtmView,
  ScrollViewContainer,
  WordContainer,
  BlurryView,
  ErrorMessageView,
} from "./style";
import ModalOcr from "../../components/ModalOcr";
import { LoadingIndicator } from "../../components";
import { useCameraPermissions } from "expo-camera";
import { selectedWords, saveWordPair } from "../../hooks/useOcrRecognition";
import { takePhotoHandler, pickImageHandler } from "../../hooks/ocrHandlers";

export const OcrScreen = ({ navigation, route }) => {
  const mainFlag = route.params.main;
  const targetFlag = route.params.target;

  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState<null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translatedWord, setTranslatedWord] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraAnimationRef = useRef<LottieView>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adUnitId =
    Platform.OS === "android"
      ? "ca-app-pub-2210071155853586/4793147397"
      : "ca-app-pub-2210071155853586/1045474070";

  const [adLoaded, setAdLoaded] = useState(false);
  const rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  const userId = auth.currentUser?.uid;
  const screenHeight = Dimensions.get("screen").height;

  // Load Rewarded Ad
  useEffect(() => {
    rewardedAd.load();

    const onAdLoaded = () => setAdLoaded(true);
    const onAdEarnedReward = () => {
      console.log("User earned reward");

      // Save the word pair after reward is earned
      saveWordPair(
        selectedWord,
        translatedWord,
        mainFlag,
        targetFlag,
        userId,
        resultText,
        setModalVisible,
        setSelectedWord,
        setTranslatedWord,
        setSelectedIndices
      );
    };

    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      onAdLoaded
    );
    const unsubscribeEarnedReward = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      onAdEarnedReward
    );

    return () => {
      unsubscribeLoaded();
      unsubscribeEarnedReward();
    };
  }, [selectedWord, translatedWord]);

  const showRewardedAd = () => {
    if (adLoaded) {
      rewardedAd.show();
    } else {
      Alert.alert(
        "Ad not ready",
        "The ad is still loading. Please try again in a few seconds."
      );
      rewardedAd.load(); // Load the ad again
    }
  };

  // Check language family
  useEffect(() => {
    const family = Flags[mainFlag]?.family;
    const supportedFamilies = [
      "Chinese",
      "Japanese",
      "Korean",
      "Devanagari",
      "Latin",
    ];

    if (!supportedFamilies.includes(family)) {
      setError("The language family doesn't support text recognition.");
      setTimeout(() => navigation.goBack(), 3000); // Go back after 3 seconds
    }
  }, [mainFlag, navigation]);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <Container
        style={{
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          maxHeight: screenHeight / 2,
        }}
      >
        <BackButtonContainer onPress={() => navigation.goBack()}>
          <BackButtonIcon source={Images.back_icon} />
        </BackButtonContainer>
        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 20,
              color: "#333",
            }}
          >
            We need your permission to access the camera
          </Text>
          <Button
            onPress={requestPermission}
            title="Grant Permission"
            color={Colors.main_yellow}
          />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        {loading && (
          <BlurryView>
            <LoadingIndicator />
          </BlurryView>
        )}

        {error && (
          <BlurryView>
            <ErrorMessageView>
              <Text>{error}</Text>
              <Button title="Back" onPress={() => navigation.goBack()} />
            </ErrorMessageView>
          </BlurryView>
        )}

        {!error && (
          <CameraContainer
            facing="back"
            autofocus="on"
            flash="auto"
            ref={(ref) => setCamera(ref as any)}
          >
            <BackButtonContainer onPress={() => navigation.goBack()}>
              <BackButtonIcon source={Images.back_icon} />
            </BackButtonContainer>
            <ControlPanel>
              <ControlPanelButtons>
                <TouchableOpacity
                  onPress={() =>
                    takePhotoHandler(
                      camera,
                      cameraAnimationRef,
                      setLoading,
                      mainFlag,
                      setResultText
                    )
                  }
                >
                  <LottieAnimation
                    ref={cameraAnimationRef}
                    source={Images.lottie_capture}
                    loop={false}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    pickImageHandler(
                      setLoading,
                      setError,
                      cameraAnimationRef,
                      mainFlag,
                      setResultText
                    )
                  }
                >
                  <GalleryButton source={Images.gallery_btn} />
                </TouchableOpacity>
              </ControlPanelButtons>

              {resultText && (
                <HomeBtmView>
                  <ScrollViewContainer>
                    <WordContainer>
                      {resultText.split(/\s+/).map((result, index) => (
                        <WordView
                          key={index}
                          isSelected={selectedIndices.includes(index)}
                        >
                          <Pressable
                            onPress={() =>
                              selectedWords(
                                result,
                                index,
                                mainFlag,
                                targetFlag,
                                setSelectedWord,
                                setTranslatedWord,
                                setLoading,
                                setModalVisible
                              )
                            }
                          >
                            <WordText>{result}</WordText>
                          </Pressable>
                        </WordView>
                      ))}
                    </WordContainer>
                  </ScrollViewContainer>
                </HomeBtmView>
              )}
            </ControlPanel>
          </CameraContainer>
        )}

        <ModalOcr
          visible={modalVisible}
          selectedWord={selectedWord}
          translatedWord={translatedWord}
          onSave={showRewardedAd} // Show ad before saving
          onCancel={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </Container>
  );
};
