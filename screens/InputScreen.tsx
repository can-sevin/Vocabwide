import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from '../components';
import { BottomTextWhite, GeneralButton, GeneralButtonText, SignupKeyboardAvoiding } from '../styles/HomeScreen';
import { Colors, auth, database } from '../config'; // Import auth and database
import { Formik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import { ref, get, set } from 'firebase/database'; // Import Firebase database functions
import { ScrollView } from 'react-native-gesture-handler';

export const background = require('../assets/background_img.jpg');
const back_icon = require("../assets/icons/back.png");

// Custom validation schema for word input
const wordValidationSchema = Yup.object().shape({
  words: Yup.string()
    .matches(/^\S+(\s\S+)+$/, "Please enter multiple words separated by spaces")
    .required('Words input is required'),
});

export const InputScreen = ({ navigation }) => {
  const handleAddingWords = async (values: { words: string }) => {
    const { words } = values;
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }

    const userId = currentUser.uid;
    const userWordsRef = ref(database, `users/${userId}/words`);

    try {
      // Get the current words array from the database
      const snapshot = await get(userWordsRef);
      let currentWords = snapshot.exists() ? snapshot.val() : [];
  
      // Convert current words to lowercase for case-insensitive comparison
      const currentWordsLowercase = currentWords.map((word: string) => word.toLowerCase());
  
      // Split the input words by spaces and convert to lowercase
      const newWords = words.trim().split(/\s+/);
      const uniqueNewWords = newWords.filter((word) => !currentWordsLowercase.includes(word.toLowerCase()));
  
      if (uniqueNewWords.length === 0) {
        console.log("No new unique words to add.");
        return;
      }
  
      // Combine currentWords with uniqueNewWords
      const updatedWords = [...currentWords, ...uniqueNewWords];
  
      // Use `set` to directly replace the words array
      await set(userWordsRef, updatedWords);
  
      console.log("Words successfully added:", updatedWords);
    } catch (error) {
      console.error("Error adding words to the database:", error);
    }
  };
  
  return (
    <ImageBackground source={background} style={styles.container} resizeMode="cover" blurRadius={6}>
      <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
        <Image style={{ width: 36, height: 36, marginLeft: 20, marginTop: 20 }} source={back_icon} />
      </TouchableOpacity>
      <Text style={styles.header_text}>Input Page</Text>
      <View style={{ marginTop: 128 }}>
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
              <BottomTextWhite style={{ textAlign: 'center', marginVertical: 12 }}>
                If you want to add multiple words, please separate each word with a space.
              </BottomTextWhite>
              <GeneralButton onPress={() => handleSubmit()}>
                <GeneralButtonText>Add Words</GeneralButtonText>
              </GeneralButton>
            </SignupKeyboardAvoiding>
          )}
        </Formik>
        <Text style={styles.header_text}>Last Added Words</Text>
        <ScrollView style={{ paddingVertical: 8 }}>
          <BottomTextWhite style={{ marginVertical: 8 }}>Deneme</BottomTextWhite>
          <BottomTextWhite style={{ marginVertical: 8 }}>Deneme</BottomTextWhite>
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
