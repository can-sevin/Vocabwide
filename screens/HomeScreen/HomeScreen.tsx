import React, { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, ImageBackground, Image, SafeAreaView } from "react-native";
import { signOut } from "firebase/auth";
import { auth, database, Flags, Images } from "../../config";
import { ref, get } from "firebase/database";
import { FadeInDown } from 'react-native-reanimated';
import {
  HomeLayout, HomeHeaderSmallTextNumber, HomeHeaderTextNumber, HomeHeaderText, 
  HomeHeaderLanguageView, HomeHeaderLanguageViewText, HomeLanguageWordsView, 
  HomePracticeButton, HomePracticeButtonText, BottomTextWhite, HomeBtmView, 
  HomeBtmIcons, HomeBtmIconText, HomeVerticalView, LanguageScrollView, 
  LanguageInsideAlphabetView, LanguageInsideAlphabetText, LanguageInsideView, 
  LanguageInsiderView, LanguageInsiderText, HomeLayoutHeader,
  HomeWordNumberView,
  LogoutIcon
} from "./HomeScreen.styles";
import { useFocusEffect } from "@react-navigation/native";
import { LoadingIndicator } from "../../components";

export const HomeScreen = ({ uid, navigation }) => {
  const [wordsList, setWordsList] = useState<[string, string][]>([]);
  const [word_num, setWordNum] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [showText, setShowText] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleListingWords = async () => {
    setLoading(true);
    const originalWordsRef = ref(database, `users/${uid}/originalWords`);
    const translatedWordsRef = ref(database, `users/${uid}/translatedWords`);

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

      setWordNum(currentOriginalWords.length)
      combinedWords.sort((a: string[], b: string[]) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));
      setWordsList(combinedWords);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching the word service. Please try again", error);
      setLoading(false);
    }
  };

  const LanguageView = () => {
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
            <LanguageInsideAlphabetView>
              <LanguageInsideAlphabetText>{letter}</LanguageInsideAlphabetText>
            </LanguageInsideAlphabetView>
  
            {groupedWords[letter].map(([originalWord, translatedWord], index) => (
              <LanguageInsideView key={index}>
                <LanguageInsiderView>
                  <LanguageInsiderText>{originalWord}</LanguageInsiderText>
                  <LanguageInsiderText>{translatedWord}</LanguageInsiderText>
                </LanguageInsiderView>
              </LanguageInsideView>
            ))}
          </View>
        ))}
      </LanguageScrollView>
      )}
    </>
  )};

  useEffect(() => {
    if (uid) {
      handleListingWords();
    } else {
      console.log("No user is currently logged in.");
    }
  }, [uid]);

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
              <HomeHeaderSmallTextNumber entering={FadeInDown.duration(3000).delay(500)}>
                Hello, {userInfo.username}
              </HomeHeaderSmallTextNumber>
            )}
          </HomeLayoutHeader>

          <View>
            <HomeWordNumberView>
              <HomeHeaderTextNumber entering={FadeInDown.duration(3000).delay(500)}>{word_num}</HomeHeaderTextNumber>
              <HomeHeaderText>Words</HomeHeaderText>
            </HomeWordNumberView>
            <HomeHeaderLanguageView>
              <HomeHeaderLanguageViewText>ENG {Flags.eng}</HomeHeaderLanguageViewText>
              <HomeHeaderLanguageViewText>TUR {Flags.tur}</HomeHeaderLanguageViewText>
            </HomeHeaderLanguageView>
            <HomeLanguageWordsView>
              <LanguageView />
            </HomeLanguageWordsView>
            <HomePracticeButton>
              <HomePracticeButtonText>Practice</HomePracticeButtonText>
            </HomePracticeButton>
            <TouchableOpacity onPress={() => navigation.navigate("Input")}>
              <BottomTextWhite>Or You can add new word by input</BottomTextWhite>
            </TouchableOpacity>
          </View>

          <HomeBtmView>
            <TouchableOpacity onPress={() => navigation.navigate("Speech")}>
              <HomeBtmIcons source={Images.mic_icon} />
              <HomeBtmIconText>Voice</HomeBtmIconText>
            </TouchableOpacity>
            <HomeVerticalView />
            <TouchableOpacity onPress={() => navigation.navigate("Ocr")}>
              <HomeBtmIcons source={Images.cam_icon} />
              <HomeBtmIconText>Camera</HomeBtmIconText>
            </TouchableOpacity>
          </HomeBtmView>
        </HomeLayout>
      </SafeAreaView>
    </ImageBackground>
  );
};