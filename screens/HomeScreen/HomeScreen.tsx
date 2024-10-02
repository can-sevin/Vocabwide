import React, { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, ImageBackground, SafeAreaView, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth, database, Flags, Images } from "../../config";
import { ref, get, set } from "firebase/database";
import { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from "@react-navigation/native";
import {
  HomeLayout, HomeHeaderSmallTextNumber, HomeHeaderTextNumber, HomeHeaderText, 
  HomeHeaderLanguageView, HomeHeaderLanguageViewText, HomeLanguageWordsView, 
  HomePracticeButton, HomePracticeButtonText, BottomTextWhite, HomeBtmView, 
  HomeBtmIcons, HomeBtmIconText, HomeVerticalView, 
  HomeLayoutHeader, HomeWordNumberView, LogoutIcon 
} from "./HomeScreen.styles";
import { ModalFlag } from "../../components/ModalFlag";
import LanguageView from "../../components/LanguageView";

export const HomeScreen = ({ uid, navigation }) => {
  const [wordsList, setWordsList] = useState<[string, string][]>([]);
  const [word_num, setWordNum] = useState(0);
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [showText, setShowText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mainFlag, setMainFlag] = useState<FlagKey>("en");
  const [targetFlag, setTargetFlag] = useState<FlagKey>("tr");
  const [flag, setFlag] = useState("main");

  type FlagKey = keyof typeof Flags;

  const openFlagModal = (type: string) => {
    setFlag(type);
    setModalVisible(true);
  };

const saveFlagsToFirebase = async (uid: string, mainFlag: FlagKey, targetFlag: FlagKey) => {
  const userFlagsRef = ref(database, `users/${uid}/flags`);
  try {
    await set(userFlagsRef, {
      mainFlag: mainFlag,
      targetFlag: targetFlag
    });
  } catch (error) {
    console.error("Error saving flags to Firebase: ", error);
  }
};

const fetchFlagsFromFirebase = async (uid: string) => {
  const userFlagsRef = ref(database, `users/${uid}/flags`);
  try {
    const snapshot = await get(userFlagsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data.mainFlag && data.targetFlag) {
        setMainFlag(data.mainFlag as FlagKey);
        setTargetFlag(data.targetFlag as FlagKey);
      }
    } else {
      console.log("No flags found in Firebase, using default flags.");
    }
  } catch (error) {
    console.error("Error fetching flags from Firebase: ", error);
  }
};

  const handleSaveMainFlag = (flagName: FlagKey) => {
    if (flagName !== targetFlag) {
      setMainFlag(flagName);
      saveFlagsToFirebase(uid, flagName, targetFlag); // Save to Firebase
    }
    setModalVisible(false);
  };

  const handleSaveTargetFlag = (flagName: FlagKey) => {
    if (flagName !== mainFlag) {
      setTargetFlag(flagName);
      saveFlagsToFirebase(uid, mainFlag, flagName); // Save to Firebase
    }
    setModalVisible(false);
  };

  const handleCancelFlagSelection = () => {
    setModalVisible(false);
  };

  const handleListingWords = async () => {
    setLoading(true);
    setWordNum(0);
    setDisplayedNumber(0);
    
    const originalWordsRef = ref(database, `users/${uid}/${mainFlag}${targetFlag}originalWords`);
    const translatedWordsRef = ref(database, `users/${uid}/${mainFlag}${targetFlag}translatedWords`);

    try {
      const originalSnapshot = await get(originalWordsRef);
      const translatedSnapshot = await get(translatedWordsRef);

      let currentOriginalWords = originalSnapshot.exists() ? originalSnapshot.val() : [];
      let currentTranslatedWords = translatedSnapshot.exists() ? translatedSnapshot.val() : [];

      if (!Array.isArray(currentOriginalWords) || !Array.isArray(currentTranslatedWords)) {
        currentOriginalWords = [];
        currentTranslatedWords = [];
        console.log("Hello new user. If you want to start, you need to add words.");
      }

      const combinedWords = currentOriginalWords.map((originalWord: any, index: number) => {
        const translatedWord = currentTranslatedWords[index] || "";
        return [originalWord, translatedWord];
      });

      setWordNum(currentOriginalWords.length);
      combinedWords.sort((a: string[], b: string[]) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));
      setWordsList(combinedWords);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching the word service. Please try again", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchFlagsFromFirebase(uid);
      handleListingWords();
    } else {
      console.log("No user is currently logged in.");
    }
  }, [uid, mainFlag, targetFlag]);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (word_num > 0) {
      let currentNumber = 0;
      interval = setInterval(() => {
        currentNumber += 1;
        setDisplayedNumber(currentNumber);

        if (currentNumber >= word_num) {
          clearInterval(interval);
        }
      }, 400);
    }

    return () => clearInterval(interval);
  }, [word_num]);

  useFocusEffect(
    useCallback(() => {
      handleListingWords();

      const fetchUserInfo = async () => {
        const userRef = ref(database, `users/${uid}`);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserInfo(snapshot.val());
            setShowText(true);
          } else {
            console.log("User data not found");
          }
        } catch (error) {
          console.log("Error fetching user data: " + error.message);
        }
      };

      fetchUserInfo();
    }, [uid])
  );

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

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
                Hello, {userInfo.username}
              </HomeHeaderSmallTextNumber>
            )}
          </HomeLayoutHeader>

          <View>
            <HomeWordNumberView>
              <HomeHeaderTextNumber entering={FadeInDown.duration(2000).delay(500)}>{displayedNumber}</HomeHeaderTextNumber>
              <HomeHeaderText>Words</HomeHeaderText>
            </HomeWordNumberView>
            <HomeHeaderLanguageView>
              <TouchableOpacity onPress={() => openFlagModal('main')}>
                <HomeHeaderLanguageViewText>{Flags[mainFlag].flag} - {Flags[mainFlag].language}</HomeHeaderLanguageViewText>
              </TouchableOpacity>
              <Text style={{color: 'white', alignSelf: 'center', fontSize: 20}}>TO</Text>
              <TouchableOpacity onPress={() => openFlagModal('target')}>
                <HomeHeaderLanguageViewText>{Flags[targetFlag].flag} - {Flags[targetFlag].language}</HomeHeaderLanguageViewText>
              </TouchableOpacity>
            </HomeHeaderLanguageView>
            <HomeLanguageWordsView>
              <LanguageView wordsList={wordsList} loading={loading} />
            </HomeLanguageWordsView>
            <HomePracticeButton>
              <HomePracticeButtonText>Practice</HomePracticeButtonText>
            </HomePracticeButton>
            <TouchableOpacity onPress={() => navigation.navigate("Input",{
              main: mainFlag, target: targetFlag
            })}>
              <BottomTextWhite>Or You can add a new word by input</BottomTextWhite>
            </TouchableOpacity>
          </View>

          <HomeBtmView>
            <TouchableOpacity onPress={() => navigation.navigate("Speech",{
              main: mainFlag, target: targetFlag
            })}>
              <HomeBtmIcons source={Images.mic_icon} />
              <HomeBtmIconText>Voice</HomeBtmIconText>
            </TouchableOpacity>
            <HomeVerticalView />
            <TouchableOpacity onPress={() => navigation.navigate("Ocr",{
              main: mainFlag, target: targetFlag
            })}>
              <HomeBtmIcons source={Images.cam_icon} />
              <HomeBtmIconText>Camera</HomeBtmIconText>
            </TouchableOpacity>
          </HomeBtmView>
        </HomeLayout>
        <ModalFlag 
          modalVisible={modalVisible}
          onSave={flag === "main" ? handleSaveMainFlag : handleSaveTargetFlag}
          onCancel={handleCancelFlagSelection}
          excludeFlag={flag === "main" ? targetFlag : mainFlag}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};