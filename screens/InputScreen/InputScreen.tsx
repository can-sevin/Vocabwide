import React, { useState } from 'react';
import { ImageBackground } from 'react-native';
import { LoadingIndicator, TextInput } from '../../components';
import { 
  BottomTextWhite, 
  GeneralButton, 
  GeneralButtonText, 
  SignupKeyboardAvoiding, 
  Container, 
  HeaderText, 
  BackButton, 
  BackButtonImage, 
  ScrollContainer, 
  FormView
} from './InputScreen.styles'; 
import { auth, database, Images } from '../../config'; 
import { Formik } from 'formik';
import * as Yup from 'yup'; 
import { ref, get, set } from 'firebase/database'; 
import translate from 'translate-google-api'; 

const wordValidationSchema = Yup.object().shape({
  words: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Please enter a valid word or words")
    .required('Words input is required'),
});

export const InputScreen = ({ navigation }) => {
  const [text, setText] = useState<string>('If you want to add multiple words, please separate each word with a space.');
  const [wordsList, setWordsList] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const handleAddingWords = async (values: { words: string }) => {
    const { words } = values;
    setLoading(true);
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }
  
    const userId = currentUser.uid;
    const originalWordsRef = ref(database, `users/${userId}/originalWords`);
    const translatedWordsRef = ref(database, `users/${userId}/translatedWords`);
  
    try {
      const originalSnapshot = await get(originalWordsRef);
      let currentOriginalWords = originalSnapshot.exists() ? originalSnapshot.val() : [];
  
      if (!Array.isArray(currentOriginalWords)) {
        currentOriginalWords = [];
      }
  
      const newWords = words.trim().split(/\s+/).map(word => word.toLowerCase());
      const uniqueNewWords = newWords.filter(word => !currentOriginalWords.includes(word));
  
      if (uniqueNewWords.length === 0) {
        setText("No new unique words to add.");
        return;
      }
  
      try {
        const translatedWords = await translate(uniqueNewWords, {
          tld: "com",
          to: "tr"
        });
  
        if (!translatedWords || translatedWords.length !== uniqueNewWords.length) {
          console.log("Translation failed or mismatched length.");
          setText("Error translating words.");
          return;
        }
  
        const translatedSnapshot = await get(translatedWordsRef);
        let currentTranslatedWords = translatedSnapshot.exists() ? translatedSnapshot.val() : [];
  
        if (!Array.isArray(currentTranslatedWords)) {
          currentTranslatedWords = [];
        }
  
        const updatedOriginalWords = [...currentOriginalWords, ...uniqueNewWords];
        const updatedTranslatedWords = [...currentTranslatedWords, ...translatedWords];
  
        await set(originalWordsRef, updatedOriginalWords);
        await set(translatedWordsRef, updatedTranslatedWords);
  
        const formattedWordsList = updatedOriginalWords.map((word, index) => `${word} -> ${updatedTranslatedWords[index]}`);
        setWordsList(formattedWordsList.reverse());
        setText(`Words successfully added: ${uniqueNewWords.join(", ")}`);
        setLoading(false);
      } catch (translateError) {
        console.error("Error during translation:", translateError);
        setText("Error translating words. Please check your internet connection or try again later.");
        setLoading(false);
      }
    } catch (error) {
      setText("Error adding words to the database.");
      console.error("Error adding words to the database", error);
      setLoading(false);
    }
  };
          
  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }} resizeMode="cover" blurRadius={6}>
      <Container>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonImage source={Images.back_icon} />
        </BackButton>
        <HeaderText>Input Page</HeaderText>
        <FormView>
          <Formik
            initialValues={{
              words: "",
            }}
            validationSchema={wordValidationSchema}
            onSubmit={(values) => handleAddingWords(values)}
          >
            {({ values, handleChange, handleSubmit, handleBlur }) => (
              <SignupKeyboardAvoiding enableOnAndroid={true}>
                <TextInput
                  name="words"
                  placeholder="Enter words"
                  autoCapitalize="none"
                  keyboardType="default"
                  autoFocus={true}
                  value={values.words}
                  onChangeText={handleChange("words")}
                  onBlur={handleBlur("words")}
                />
                <BottomTextWhite>
                  {text}
                </BottomTextWhite>
                {loading ? (
                  <LoadingIndicator />
                ) : (
                  <GeneralButton onPress={() => handleSubmit()}>
                    <GeneralButtonText>Login</GeneralButtonText>
                  </GeneralButton>
                )}
              </SignupKeyboardAvoiding>
            )}
          </Formik>
          <HeaderText>Last Added Words</HeaderText>
          <ScrollContainer>
            {wordsList.map((word, index) => (
              <BottomTextWhite key={index}>{word}</BottomTextWhite>
            ))}
          </ScrollContainer>
        </FormView>
      </Container>
    </ImageBackground>
  );
};

export default InputScreen;