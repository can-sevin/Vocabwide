import React from "react";
import { View, StyleSheet, Button, Text, SafeAreaView, TouchableOpacity, Image, ScrollView } from "react-native";
import { signOut } from "firebase/auth";

import { auth, Colors } from "../config";
import { openApplicationSettings } from "../utils";
import { HomeBtmIcons, HomeBtmIconText, HomeBtmView, HomeHeaderLanguageView, HomeHeaderLanguageViewText, HomeHeaderText, HomeLanguageWordsView, HomeLayout, HomePracticeButton, HomePracticeButtonText, HomeVerticalView, LanguageInsideAlphabetText, LanguageInsideAlphabetView, LanguageInsideHeaderAlphabetView, LanguageInsiderText, LanguageInsiderView, LanguageInsideText, LanguageInsideView, LanguageScrollView } from "../styles/HomeScreen";

const mic_icon = require('../assets/icons/mic_permission.png');
const cam_icon = require('../assets/icons/cam_permission.png');

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

export const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  return (
    <HomeLayout>
      <View>
      <HomeHeaderText>Words</HomeHeaderText>
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
      </View>
      <HomeBtmView>
        <TouchableOpacity onPress={() => navigation.navigate("Speech")}>
          <HomeBtmIcons source={mic_icon}/>
          <HomeBtmIconText>Voice</HomeBtmIconText>
        </TouchableOpacity>
        <HomeVerticalView />
        <TouchableOpacity onPress={() => openApplicationSettings()}>
          <HomeBtmIcons source={cam_icon}/>
          <HomeBtmIconText>Camera</HomeBtmIconText>
        </TouchableOpacity>
      </HomeBtmView>
    </HomeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.purple,
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
});
