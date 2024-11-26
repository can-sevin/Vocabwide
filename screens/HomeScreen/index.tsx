import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Alert,
  Image,
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

  const mainFlagPosition = useSharedValue(0);
  const targetFlagPosition = useSharedValue(1);

  type FlagKey = keyof typeof Flags;

  const handleExchangeFlags = () => {
    // Swap flags
    setMainFlag((prev) => {
      const newMain = targetFlag;
      setTargetFlag(prev);
      saveFlagsToFirebase(uid, newMain, prev); // Update Firebase
      return newMain;
    });

    // Animate positions
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

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const onWordDeleted = () => {
    setWordNum((prev) => prev - 1);
  };

  const saveFlagState = (flagName: FlagKey, isMain: boolean) => {
    const newMainFlag = isMain ? flagName : mainFlag;
    const newTargetFlag = isMain ? targetFlag : flagName;

    if (isMain) {
      setMainFlag(flagName);
    } else {
      setTargetFlag(flagName);
    }

    saveFlagsToFirebase(uid, newMainFlag, newTargetFlag);
    setModalVisible(false);
  };

  useEffect(() => {
    if (uid) {
      fetchFlagsFromFirebase(uid, (mainFlag, targetFlag) => {
        saveFlagState(mainFlag as FlagKey, true);
        saveFlagState(targetFlag as FlagKey, false);
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
      let currentNumber = 0;
      setDisplayedNumber(currentNumber);
    }

    return () => clearInterval(interval);
  }, [wordNum]);

  const handlePracticePress = () => {
    if (wordNum >= 10) {
      navigation.navigate("Question", {
        main: mainFlag,
        target: targetFlag,
        uid: uid,
        wordsList,
      });
    } else {
      Alert.alert(
        "Insufficient words",
        "You want to practice with words, you should add 10 or more words.",
        [{ text: "OK" }]
      );
    }
  };

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
                  First, You need to start by adding words.
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
                  onWordDeleted={onWordDeleted}
                />
              )}
            </HomeLanguageWordsView>
          </HomeTopView>
          <HomeBottomView>
            <View style={{ marginBottom: 16 }}>
              <HomePracticeButton
                onPress={handlePracticePress}
                style={{
                  backgroundColor:
                    wordNum >= 10 ? Colors.main_yellow : Colors.LighterGray2,
                }}
              >
                <HomePracticeButtonText
                  style={{ color: wordNum >= 10 ? Colors.white : Colors.black }}
                >
                  Practice
                </HomePracticeButtonText>
              </HomePracticeButton>
            </View>
            <HomeBtmView>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Speech", {
                    main: mainFlag,
                    target: targetFlag,
                  })
                }
              >
                <HomeBtmIcons source={Images.mic_icon} />
                <HomeBtmIconText>Voice</HomeBtmIconText>
              </TouchableOpacity>
              <HomeVerticalView />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Input", {
                    main: mainFlag,
                    target: targetFlag,
                  })
                }
              >
                <HomeBtmIcons source={Images.keyboard} />
                <HomeBtmIconText>Input</HomeBtmIconText>
              </TouchableOpacity>
              <HomeVerticalView />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Ocr", {
                    main: mainFlag,
                    target: targetFlag,
                  })
                }
              >
                <HomeBtmIcons source={Images.cam_icon} />
                <HomeBtmIconText>Camera</HomeBtmIconText>
              </TouchableOpacity>
            </HomeBtmView>
          </HomeBottomView>
        </HomeLayout>
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
