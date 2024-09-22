import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from '../components';
import { BottomTextWhite, GeneralButton, GeneralButtonText, SignupKeyboardAvoiding } from '../styles/HomeScreen';
import { Colors, auth, database } from '../config'; // Import auth and database
import { Formik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import { ref, get, set } from 'firebase/database'; // Import Firebase database functions
import { ScrollView } from 'react-native-gesture-handler';
import translate from 'translate-google-api'; // Import the translation package

export const background = require('../assets/background_img.jpg');
const back_icon = require("../assets/icons/back.png");

// Custom validation schema for word input
const wordValidationSchema = Yup.object().shape({
  words: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Please enter a valid word or words")
    .required('Words input is required'),
});

export const InputScreen = ({ navigation }) => {
  const [text, setText] = useState<string>('If you want to add multiple words, please separate each word with a space.');
  const [wordsList, setWordsList] = useState<string[]>(['']);
  
  const handleAddingWords = async (values: { words: string }) => {
    const { words } = values;
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }
  
    const userId = currentUser.uid;
    const originalWordsRef = ref(database, `users/${userId}/originalWords`);
    const translatedWordsRef = ref(database, `users/${userId}/translatedWords`);
  
    try {
      // Fetch existing original words from Firebase
      const originalSnapshot = await get(originalWordsRef);
      let currentOriginalWords = originalSnapshot.exists() ? originalSnapshot.val() : [];
  
      if (!Array.isArray(currentOriginalWords)) {
        currentOriginalWords = [];
      }
  
      // Process the new words
      const newWords = words.trim().split(/\s+/).map(word => word.toLowerCase());
      const uniqueNewWords = newWords.filter(word => !currentOriginalWords.includes(word));
  
      if (uniqueNewWords.length === 0) {
        setText("No new unique words to add.");
        return;
      }
  
      // Attempt to translate the unique new words using translate-google-api
      try {
        const translatedWords = await translate(uniqueNewWords, {
          tld: "com",  // Adjust domain if necessary
          to: "tr"     // Target language for translation (Turkish in this case)
        });
  
        // Check if translation returned correctly
        if (!translatedWords || translatedWords.length !== uniqueNewWords.length) {
          console.log("Translation failed or mismatched length.");
          setText("Error translating words.");
          return;
        }
  
        // Fetch existing translated words from Firebase
        const translatedSnapshot = await get(translatedWordsRef);
        let currentTranslatedWords = translatedSnapshot.exists() ? translatedSnapshot.val() : [];
  
        if (!Array.isArray(currentTranslatedWords)) {
          currentTranslatedWords = [];
        }
  
        // Combine the existing and new translated words
        const updatedOriginalWords = [...currentOriginalWords, ...uniqueNewWords];
        const updatedTranslatedWords = [...currentTranslatedWords, ...translatedWords];
  
        // Update Firebase with separate original and translated words
        await set(originalWordsRef, updatedOriginalWords);
        await set(translatedWordsRef, updatedTranslatedWords);
  
        // Format the words for display as "original -> translated"
        const formattedWordsList = updatedOriginalWords.map((word, index) => `${word} -> ${updatedTranslatedWords[index]}`);
  
        // Update the local state to reflect the added words
        setWordsList(formattedWordsList.reverse());
        setText(`Words successfully added: ${uniqueNewWords.join(", ")}`);
      } catch (translateError) {
        console.error("Error during translation:", translateError);
        setText("Error translating words. Please check your internet connection or try again later.");
      }
    } catch (error) {
      setText("Error adding words to the database.");
      console.error("Error adding words to the database", error);
    }
  };
          
  return (
    <ImageBackground source={background} style={styles.container} resizeMode="cover" blurRadius={6}>
      <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
        <Image style={{ width: 36, height: 36, marginLeft: 20, marginTop: 20 }} source={back_icon} />
      </TouchableOpacity>
      <Text style={styles.header_text}>Input Page</Text>
      <View style={{ marginTop: 128, marginHorizontal: 32 }}>
        <Formik
          initialValues={{
            words: "", // Add words field for input
          }}
          validationSchema={wordValidationSchema} // Apply word validation schema
          onSubmit={(values) => handleAddingWords(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <SignupKeyboardAvoiding enableOnAndroid={true}>
              {/* Input fields */}
              <TextInput
                name="words"
                placeholder="Enter words"
                autoCapitalize="none"
                keyboardType="default"
                autoFocus={true}
                value={values.words} // Bind formik value
                onChangeText={handleChange("words")} // Handle input change
                onBlur={handleBlur("words")} // Handle blur event
              />
              <BottomTextWhite style={{ textAlign: 'center', margin: 12 }}>
                {text}
              </BottomTextWhite>
              <GeneralButton onPress={() => handleSubmit()}>
                <GeneralButtonText>Add Words</GeneralButtonText>
              </GeneralButton>
            </SignupKeyboardAvoiding>
          )}
        </Formik>
        <Text style={styles.header_text}>Last Added Words</Text>
        <ScrollView style={{ paddingVertical: 8 }}>
          {wordsList.map((word, index) => (
          <BottomTextWhite style={{ marginVertical: 8 }} key={index}>{word}</BottomTextWhite>
        ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header_text: {
    fontSize: 32,
    paddingTop: 48,
    alignSelf: "center",
    justifyContent: "flex-start",
    textAlign: "center",
    color: Colors.white,
    fontFamily: "Helvetica-Bold",
  },
});

export default InputScreen;