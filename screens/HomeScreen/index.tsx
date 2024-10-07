import React, { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, ImageBackground, SafeAreaView, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth, Flags, Images } from "../../config";
import { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from "@react-navigation/native";
import {
  HomeLayout, HomeHeaderSmallTextNumber, HomeHeaderTextNumber, HomeHeaderText, 
  HomeHeaderLanguageView, HomeHeaderLanguageViewText, HomePracticeButton, 
  HomePracticeButtonText, BottomTextWhite, HomeBtmView, HomeBtmIcons, 
  HomeBtmIconText, HomeVerticalView, HomeLayoutHeader, HomeWordNumberView, LogoutIcon,
  HomeLanguageWordsView,
  HomeTopView,
  HomeBottomView
} from "./styles";
import { ModalFlag } from "../../components/ModalFlag";
import LanguageView from "../../components/LanguageView";
import { saveFlagsToFirebase, fetchFlagsFromFirebase, handleListingWords, fetchUserInfo } from "../../firebase/index";

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

  type FlagKey = keyof typeof Flags;

  const handleOpenModal = (flagType:string) => {
    setFlag(flagType);

    setModalVisible(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
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
      handleListingWords(uid, mainFlag, targetFlag, setWordsList, setLoading, setWordNum);
    }
  }, [uid, mainFlag, targetFlag]);

  useFocusEffect(
    useCallback(() => {
      if (uid) {
        fetchUserInfo(uid, setUserInfo, setShowText);
        handleListingWords(uid, mainFlag, targetFlag, setWordsList, setLoading, setWordNum);
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
      }, 400);
    }
    else {
      let currentNumber = 0;
      setDisplayedNumber(currentNumber);
    }

    return () => clearInterval(interval);
  }, [wordNum]);

  const handleLogout = () => signOut(auth).catch(console.error);

  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }} resizeMode="cover" blurRadius={6}>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeLayout entering={FadeInDown.duration(2000).delay(500)}>
          <HomeLayoutHeader>
            <TouchableOpacity onPress={handleLogout}>
              <LogoutIcon source={Images.log_out} />
            </TouchableOpacity>
            {showText && (
              <HomeHeaderSmallTextNumber entering={FadeInDown.duration(2000).delay(1000)}>
                Hello, {userInfo?.username}
              </HomeHeaderSmallTextNumber>
            )}
          </HomeLayoutHeader>

          <HomeTopView>
            <HomeWordNumberView>
              <HomeHeaderTextNumber entering={FadeInDown.duration(2000).delay(500)}>{displayedNumber}</HomeHeaderTextNumber>
              <HomeHeaderText>Words</HomeHeaderText>
            </HomeWordNumberView>
            <HomeHeaderLanguageView>
              <TouchableOpacity onPress={() => handleOpenModal("main")} style={{width: '80%'}}>
                <HomeHeaderLanguageViewText>{Flags[mainFlag].flag} - {Flags[mainFlag].language}</HomeHeaderLanguageViewText>
              </TouchableOpacity>
              <Text style={{ color: 'white', fontSize: 20 }}>TO</Text>
              <TouchableOpacity onPress={() => handleOpenModal("target")} style={{width: '80%'}}>
                <HomeHeaderLanguageViewText>{Flags[targetFlag].flag} - {Flags[targetFlag].language}</HomeHeaderLanguageViewText>
              </TouchableOpacity>
            </HomeHeaderLanguageView>
            <HomeLanguageWordsView>
              {
                wordsList.length === 0 ? (
                  <BottomTextWhite>First, You need start to add words</BottomTextWhite>
                ) : (
                  <LanguageView wordsList={wordsList} loading={loading} />
                )
              }
            </HomeLanguageWordsView>
          </HomeTopView>

          <HomeBottomView>
            <View style={{marginBottom: 16}}>
            <HomePracticeButton>
              <HomePracticeButtonText>Practice</HomePracticeButtonText>
            </HomePracticeButton>
            <TouchableOpacity onPress={() => navigation.navigate("Input", { main: mainFlag, target: targetFlag })}>
              <BottomTextWhite>Or You can add a new word by input</BottomTextWhite>
            </TouchableOpacity>
            </View>
          <HomeBtmView>
            <TouchableOpacity onPress={() => navigation.navigate("Speech", { main: mainFlag, target: targetFlag })}>
              <HomeBtmIcons source={Images.mic_icon} />
              <HomeBtmIconText>Voice</HomeBtmIconText>
            </TouchableOpacity>
            <HomeVerticalView />
            <TouchableOpacity onPress={() => navigation.navigate("Ocr", { main: mainFlag, target: targetFlag })}>
              <HomeBtmIcons source={Images.cam_icon} />
              <HomeBtmIconText>Camera</HomeBtmIconText>
            </TouchableOpacity>
          </HomeBtmView>
          </HomeBottomView>
        </HomeLayout>
        <ModalFlag 
          modalVisible={modalVisible}
          onSave={flag === "main" ? (flagName) => saveFlagState(flagName, true) : (flagName) => saveFlagState(flagName, false)}
          onCancel={() => setModalVisible(false)}
          excludeFlag={flag === "main" ? targetFlag : mainFlag}
          loading={loading}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};