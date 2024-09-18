import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Image, SafeAreaView} from "react-native";
import { signOut } from "firebase/auth";

import { auth, database, Colors } from "../config";
import { ref, get } from "firebase/database";  // Import Realtime Database functions

import Animated, { FadeInDown, interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { BottomTextWhite, HomeBtmIcons, HomeBtmIconText, HomeBtmView, HomeHeaderLanguageView, HomeHeaderLanguageViewText, HomeHeaderSmallTextNumber, HomeHeaderText, HomeHeaderTextAnimated, HomeHeaderTextNumber, HomeLanguageWordsView, HomeLayout, HomePracticeButton, HomePracticeButtonText, HomeVerticalView, LanguageInsideAlphabetText, LanguageInsideAlphabetView, LanguageInsideHeaderAlphabetView, LanguageInsiderText, LanguageInsiderView, LanguageInsideText, LanguageInsideView, LanguageScrollView } from "../styles/HomeScreen";

const mic_icon = require('../assets/icons/new_mic_permission.png');
const cam_icon = require('../assets/icons/new_cam_permission.png');
export const background = require('../assets/background_img.jpg');
const back_icon = require("../assets/icons/shutdown.png");

const alphabetWords = {
  A: ["Apple", "Ant"],
  B: ["Ball", "Bat"],
  C: ["Cat", "Cup"],
  D: ["Cat", "Cup"],
  F: ["Cat", "Cup"],
  // Add more letters and words as needed
};
const LanguageView = () => {
  return(
    <LanguageScrollView showsVerticalScrollIndicator={false}>
      {Object.keys(alphabetWords).map((letter) => (
        <View key={letter}>
          <LanguageInsideAlphabetView>
            <LanguageInsideAlphabetText>{letter}</LanguageInsideAlphabetText>
          </LanguageInsideAlphabetView>
          {alphabetWords[letter].map((word, index) => (
            <LanguageInsideView key={index}>
              <LanguageInsiderView>
                <LanguageInsiderText>{word}</LanguageInsiderText>
                <LanguageInsiderText>{word}</LanguageInsiderText>
              </LanguageInsiderView>
            </LanguageInsideView>
          ))}
        </View>
      ))}
    </LanguageScrollView>
  )
}

export const HomeScreen = ({ uid, navigation }) => {
  
  const [word_num, setWordNum] = useState(0);
  const button_practice_progress = useSharedValue(0);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [showText, setShowText] = useState(false);  // State to control text rendering

  useEffect(() => {
    if (uid) {
      // Set a 3-second delay before fetching the data
      const timer = setTimeout(() => {
        const userRef = ref(database, `users/${uid}`);

        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setUserInfo(snapshot.val());
              console.log(snapshot.val());
              setShowText(true);
            } else {
              console.log("User data not found");
            }
          })
          .catch((error) => {
            console.log("Error fetching user data: " + error.message);
          });
      }, 3000);  // 3000ms = 3 seconds
    } else {
      console.log("No user is currently logged in.");
    }
  }, [uid]);

  const animatedStyle = useAnimatedStyle(() => {
  return {
      backgroundColor: interpolateColor(
        button_practice_progress.value,
        [0, 1],
        ['#CA9B18', '#125EC6']
      ),
    };
  });

  useEffect(() => {
    if (word_num >= 100) return; // Stop updating when the number reaches 10

    const intervalId = setInterval(() => {
      setWordNum(prevNumber => prevNumber + 1);
    }, 25);

    // Clean up interval on component unmount or when number reaches 10
    return () => clearInterval(intervalId);
  }, [word_num]);


  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  return (
    <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover" blurRadius={6}>
    <SafeAreaView style={{ flex: 1 }}>
    <HomeLayout entering={FadeInDown.duration(2000).delay(500)}>
    <View style={{flexDirection: "row", 
      justifyContent:"space-between", 
      width: "100%", 
      alignItems: "center", 
      alignContent: 'center', 
      marginTop: 20, 
      paddingHorizontal: 32,
      }}>
    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => handleLogout()}>
        <Image style={{alignSelf: 'center', width: 36, height: 36}} source={back_icon} />  
    </TouchableOpacity>
    {showText && (
      <HomeHeaderSmallTextNumber 
        entering={FadeInDown.duration(3000).delay(500)}>
        Hello, {userInfo.username}
      </HomeHeaderSmallTextNumber>
    )}
    </View>
      <View>
        <Animated.View style={{
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          width: '70%'}}>
        <HomeHeaderTextNumber 
          entering={FadeInDown.duration(3000).delay(500)}>
          {word_num}
        </HomeHeaderTextNumber>
        <HomeHeaderText>Words</HomeHeaderText>
        </Animated.View>
      <HomeHeaderLanguageView>
        <HomeHeaderLanguageViewText>ENG 🇬🇧</HomeHeaderLanguageViewText>
        <HomeHeaderLanguageViewText>TUR 🇹🇷</HomeHeaderLanguageViewText>
      </HomeHeaderLanguageView>
      <HomeLanguageWordsView>
        <LanguageView/>
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
          <HomeBtmIcons source={mic_icon}/>
          <HomeBtmIconText>Voice</HomeBtmIconText>
        </TouchableOpacity>
        <HomeVerticalView />
        <TouchableOpacity onPress={() => navigation.navigate("Ocr")}>
          <HomeBtmIcons source={cam_icon}/>
          <HomeBtmIconText>Camera</HomeBtmIconText>
        </TouchableOpacity>
      </HomeBtmView>
    </HomeLayout>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blue_light,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  header_text: {
    fontFamily:'Circular-Bold', 
    fontSize: 42, 
    color: Colors.white,
    alignSelf: 'center', 
    marginTop: 96,
    marginVertical: 16
  },
  header_language_text: {
    fontFamily:'Circular-Bold', 
    fontSize: 24, 
    color: Colors.white,
    alignSelf: 'center', 
    marginVertical: 12,
    textAlign: 'center'
  },
  header_line: {
    height: 1, 
    width: '80%', 
    backgroundColor: Colors.white,
  },
  header_line_vertical: {
    width: 1, 
    height: 160, 
    backgroundColor: Colors.black,
  },
  card_view: {
    height: 42,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: Colors.whiteLight,
  },
  card_view_text: {
    color: Colors.black,
    fontSize: 16,
    fontFamily:'Circular-Medium',
    textAlign: 'center'
  },
  icons: {
    height: 64,
    width: 64,
    marginBottom: 12,
  },
  icon_text: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Circular-Bold',
    textAlign: 'center',
  },
  btm_view: {
    backgroundColor: Colors.whiteLight,
    height: 180, 
    width: '100%', 
    borderRadius: 24, 
    alignItems: 'center', 
    justifyContent: 'space-evenly', 
    flexDirection: 'row',
  },
  numberContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  numberText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
});
