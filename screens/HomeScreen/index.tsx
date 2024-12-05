import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Alert,
  Image,
  Platform,
} from "react-native";
import { Colors, Flags, Images } from "../../config";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import {
  HomeLayout,
  HomeHeaderTextNumber,
  HomeHeaderText,
  HomeHeaderLanguageView,
  HomeHeaderLanguageViewText,
  HomePracticeButton,
  HomePracticeButtonText,
  HomeBtmView,
  HomeBtmIcons,
  HomeBtmIconText,
  HomeVerticalView,
  HomeWordNumberView,
  HomeLanguageWordsView,
  HomeTopView,
  HomeBottomView,
  EmptyWordText,
} from "./styles";
import { ModalFlag } from "../../components/ModalFlag";
import LanguageView from "../../components/LanguageView";
import {
  saveFlagsToFirebase,
  fetchFlagsFromFirebase,
  handleListingWords,
  fetchUserInfo,
} from "../../firebase/index";
import TutorialModal from "../../components/TutorialModal/TutorialModal";
import { AppOpenAd } from "react-native-google-mobile-ads";

export const HomeScreen = ({ uid, navigation }) => {
  const [wordsList, setWordsList] = useState<[string, string][]>([]);
  const [wordNum, setWordNum] = useState(0);
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [showText, setShowText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mainFlag, setMainFlag] = useState<FlagKey>("en");
  const [targetFlag, setTargetFlag] = useState<FlagKey>("tr");
  const [flag, setFlag] = useState("main");
  const [tutorialVisible, setTutorialVisible] = useState(false);

  const mainFlagPosition = useSharedValue(0);
  const targetFlagPosition = useSharedValue(1);

  const adUnitId =
    Platform.OS === "android"
      ? "ca-app-pub-2210071155853586/3496647097"
      : "ca-app-pub-2210071155853586/3182059546";

  const rewardedAd = AppOpenAd.createForAdRequest(adUnitId);

  type FlagKey = keyof typeof Flags;

  const initAds = () => {
    rewardedAd.load();
  };

  useEffect(() => {
    initAds();

    setTimeout(() => {
      if (rewardedAd.loaded) {
        rewardedAd.show();
      } else {
        console.log("Reklam henüz yüklenmedi.");
      }
    }, 4000);
  }, []);

  const showRewardedAd = async (path: string) => {
    if (path) {
      navigation.navigate(path, {
        main: mainFlag,
        target: targetFlag,
      });
    } else {
      console.error("No valid navigation path provided!");
    }
  };

  // Swap flags logic
  const handleExchangeFlags = () => {
    setMainFlag((prev) => {
      const newMain = targetFlag;
      setTargetFlag(prev);
      saveFlagsToFirebase(uid, newMain, prev);
      return newMain;
    });

    mainFlagPosition.value = withTiming(mainFlagPosition.value === 0 ? 1 : 0);
    targetFlagPosition.value = withTiming(
      targetFlagPosition.value === 1 ? 0 : 1
    );
  };

  // Animated styles
  const mainFlagStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(mainFlagPosition.value) }],
  }));

  const targetFlagStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(targetFlagPosition.value) }],
  }));

  const exchangeIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${mainFlagPosition.value * 180}deg` }],
  }));

  const handleOpenModal = (flagType: string) => {
    setFlag(flagType);
    setModalVisible(true);
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const saveFlagState = (flagName: FlagKey, isMain: boolean) => {
    if (isMain) {
      setMainFlag(flagName);
    } else {
      setTargetFlag(flagName);
    }
    saveFlagsToFirebase(
      uid,
      isMain ? flagName : mainFlag,
      isMain ? targetFlag : flagName
    );
    setModalVisible(false);
  };

  // Fetch initial flags and words
  useEffect(() => {
    if (uid) {
      fetchFlagsFromFirebase(uid, (main, target) => {
        saveFlagState(main as FlagKey, true);
        saveFlagState(target as FlagKey, false);
      });
      handleListingWords(
        uid,
        mainFlag,
        targetFlag,
        setWordsList,
        setLoading,
        setWordNum
      );
    }
  }, [uid, mainFlag, targetFlag]);

  useFocusEffect(
    useCallback(() => {
      if (uid) {
        fetchUserInfo(uid, setUserInfo, setShowText);
        handleListingWords(
          uid,
          mainFlag,
          targetFlag,
          setWordsList,
          setLoading,
          setWordNum
        );
      }
    }, [uid, mainFlag, targetFlag])
  );

  // Animate word count
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (wordNum > 0) {
      let currentNumber = 0;
      interval = setInterval(() => {
        currentNumber += 1;
        setDisplayedNumber(currentNumber);

        if (currentNumber >= wordNum) {
          clearInterval(interval);
        }
      }, 200);
    } else {
      setDisplayedNumber(0);
    }

    return () => clearInterval(interval);
  }, [wordNum]);

  return (
    <ImageBackground
      source={Images.background}
      style={{ flex: 1 }}
      resizeMode="cover"
      blurRadius={6}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <HomeLayout entering={FadeInDown.duration(2000).delay(500)}>
          <HomeTopView>
            <HomeWordNumberView>
              <HomeHeaderTextNumber
                entering={FadeInDown.duration(2000).delay(500)}
              >
                {displayedNumber}
              </HomeHeaderTextNumber>
              <HomeHeaderText>Words</HomeHeaderText>
            </HomeWordNumberView>
            <HomeHeaderLanguageView>
              <TouchableOpacity
                onPress={() => handleOpenModal("main")}
                style={{ width: "80%" }}
              >
                <HomeHeaderLanguageViewText style={mainFlagStyle}>
                  {Flags[mainFlag].flag} - {Flags[mainFlag].language}
                </HomeHeaderLanguageViewText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleExchangeFlags}>
                <Animated.Image
                  source={Images.exchange}
                  style={[{ height: 32, width: 32 }, exchangeIconStyle]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOpenModal("target")}
                style={{ width: "80%" }}
              >
                <HomeHeaderLanguageViewText style={targetFlagStyle}>
                  {Flags[targetFlag].flag} - {Flags[targetFlag].language}
                </HomeHeaderLanguageViewText>
              </TouchableOpacity>
            </HomeHeaderLanguageView>
            <HomeLanguageWordsView>
              {wordsList.length === 0 ? (
                <EmptyWordText>
                  First, you need to start by adding words.
                </EmptyWordText>
              ) : (
                <LanguageView
                  uid={uid}
                  wordsList={wordsList}
                  setWordsList={setWordsList}
                  loading={loading}
                  mainFlag={mainFlag}
                  targetFlag={targetFlag}
                  setLoading={setLoading}
                  onWordDeleted={(deletedWord) => {
                    setWordsList((prevWords) =>
                      prevWords.filter(([word]) => word !== deletedWord)
                    );
                    Alert.alert(
                      "Word Deleted",
                      `${deletedWord} has been removed.`
                    );
                  }}
                />
              )}
            </HomeLanguageWordsView>
          </HomeTopView>
          <HomeBottomView>
            <View
              style={{
                marginBottom: 16,
                paddingHorizontal: 32,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={() => setTutorialVisible(true)}
              >
                <Image
                  source={Images.question_btn}
                  style={{ width: 32, height: 32 }}
                />
              </TouchableOpacity>
              <HomePracticeButton
                onPress={() =>
                  wordNum >= 10
                    ? navigation.navigate("Question", {
                        main: mainFlag,
                        target: targetFlag,
                        uid: uid,
                        wordsList,
                      })
                    : Alert.alert(
                        "Insufficient words",
                        "You need at least 10 words to practice.",
                        [{ text: "OK" }]
                      )
                }
                style={{
                  backgroundColor:
                    wordNum >= 10 ? Colors.main_yellow : Colors.LighterGray2,
                }}
              >
                <HomePracticeButtonText
                  style={{
                    color: wordNum >= 10 ? Colors.white : Colors.black,
                  }}
                >
                  Practice
                </HomePracticeButtonText>
              </HomePracticeButton>
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={() =>
                  navigation.navigate("Past", {
                    uid: uid,
                    mainFlag: mainFlag,
                    targetFlag: targetFlag,
                  })
                }
              >
                <Image
                  source={Images.past_btn}
                  style={{ width: 32, height: 32 }}
                />
              </TouchableOpacity>
            </View>
            <HomeBtmView>
              <TouchableOpacity onPress={() => showRewardedAd("Speech")}>
                <HomeBtmIcons source={Images.mic_icon} />
                <HomeBtmIconText>Voice</HomeBtmIconText>
              </TouchableOpacity>
              <HomeVerticalView />
              <TouchableOpacity onPress={() => showRewardedAd("Input")}>
                <HomeBtmIcons source={Images.keyboard} />
                <HomeBtmIconText>Input</HomeBtmIconText>
              </TouchableOpacity>
              <HomeVerticalView />
              <TouchableOpacity onPress={() => showRewardedAd("Ocr")}>
                <HomeBtmIcons source={Images.cam_icon} />
                <HomeBtmIconText>Camera</HomeBtmIconText>
              </TouchableOpacity>
            </HomeBtmView>
          </HomeBottomView>
        </HomeLayout>
        <TutorialModal
          visible={tutorialVisible}
          onClose={() => setTutorialVisible(false)}
        />
        <ModalFlag
          modalVisible={modalVisible}
          onSave={
            flag === "main"
              ? (flagName) => saveFlagState(flagName, true)
              : (flagName) => saveFlagState(flagName, false)
          }
          onCancel={() => setModalVisible(false)}
          excludeFlag={flag === "main" ? targetFlag : mainFlag}
          loading={loading}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};
