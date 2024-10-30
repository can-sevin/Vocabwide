import React, { useState } from "react";
import { ImageBackground, Keyboard, SafeAreaView } from "react-native";
import { LoadingIndicator, TextInput } from "../../components";
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
  FormView,
} from "./styles";
import { auth, Images } from "../../config";
import { Formik } from "formik";
import { handleAddingWords } from "../../firebase/database";
import { wordValidationSchema } from "../../utils/index";

export const InputScreen = ({ navigation, route }) => {
  const mainFlag = route.params.main;
  const targetFlag = route.params.target;
  const [text, setText] = useState<string>(
    "If you want to add multiple words, please separate each word with a space."
  );
  const [wordsList, setWordsList] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: { words: string }) => {
    const { words } = values;
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userId = currentUser.uid;
      Keyboard.dismiss();
      await handleAddingWords(
        userId,
        mainFlag,
        targetFlag,
        words,
        setText,
        setWordsList,
        setLoading
      );
    } else {
      console.log("No user is currently logged in.");
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
        <Container>
          <BackButton onPress={() => navigation.goBack()}>
            <BackButtonImage source={Images.back_icon} />
          </BackButton>
          <HeaderText>Input Page</HeaderText>
          <FormView>
            <Formik
              initialValues={{ words: "" }}
              validationSchema={wordValidationSchema}
              onSubmit={handleFormSubmit}
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
                  <BottomTextWhite>{text}</BottomTextWhite>
                  <GeneralButton onPress={() => handleSubmit()}>
                    <GeneralButtonText>Add Words</GeneralButtonText>
                  </GeneralButton>
                </SignupKeyboardAvoiding>
              )}
            </Formik>
            <HeaderText>Last Added Words</HeaderText>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <ScrollContainer>
                {wordsList.map((word, index) => (
                  <BottomTextWhite key={index}>{word}</BottomTextWhite>
                ))}
              </ScrollContainer>
            )}
          </FormView>
        </Container>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default InputScreen;
