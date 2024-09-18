import React, { useState } from 'react';
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
    .matches(/^[A-Za-z\s]+$/, "Please enter a valid word or words")
    .required('Words input is required'),
});

export const InputScreen = ({ navigation }) => {
  const [text, setText] = useState<string>('If you want to add multiple words, please separate each word with a space.')
  const [wordsList, setWordsList] = useState<string[]>(['loading']);
  
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
      const snapshot = await get(userWordsRef);
      let currentWords = snapshot.exists() ? snapshot.val() : [];

      if (!Array.isArray(currentWords)) {
        currentWords = [];
      }
            
      const newWords = words.trim().split(/\s+/).map(word => word.toLowerCase());
      const uniqueNewWords = newWords.filter(word => !currentWords.includes(word.toLowerCase()));
        
      if (uniqueNewWords.length === 0) {
        setText("No new unique words to add.")
        return;
      }
  
      const updatedWords = [...currentWords, ...uniqueNewWords];
  
      await set(userWordsRef, updatedWords);

      setText(`Words successfully added: ${uniqueNewWords.join(", ")}`);
      setWordsList(uniqueNewWords);
    } catch (error) {
      setText("Error adding words to the database")
      console.log("Error adding words to the database", error)
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
          <>
            {console.log('infos', word, index)}
            <BottomTextWhite style={{ marginVertical: 8 }} key={index}>{word}</BottomTextWhite>
          </>
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
