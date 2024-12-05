import React, { useState } from "react";
import { ImageBackground, Keyboard, SafeAreaView } from "react-native";
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
import { Formik, FormikState } from "formik";
import { handleAddingWords } from "../../firebase/database";
import { wordValidationSchema } from "../../utils/index";
import { LoadingIndicator, TextInput } from "../../components";

export const InputScreen = ({ navigation, route }) => {
  const mainFlag = route.params.main;
  const targetFlag = route.params.target;

  const [text, setText] = useState(
    "If you want to add multiple words, please separate each word with a comma."
  );
  const [wordsList, setWordsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: { words: any; }, resetForm: { (nextState?: Partial<FormikState<{ words: string; }>> | undefined): void; (): void; }) => {
    const { words } = values;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }

    Keyboard.dismiss();

    const formattedWords = words
      .split(",")
      .map((word: string) => word.trim())
      .filter((word: string) => word !== "");

    if (formattedWords.length === 0) {
      setText("Please enter valid words separated by commas.");
      return;
    }

    const userId = currentUser.uid;
    setLoading(true);

    try {
      await handleAddingWords(
        userId,
        mainFlag,
        targetFlag,
        formattedWords.join(" "),
        setText,
        setWordsList,
        setLoading
      );
      resetForm();
    } catch (error) {
      console.error("Error adding words:", error);
      setText("An error occurred while adding words. Please try again.");
    } finally {
      setLoading(false);
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
              onSubmit={(values, { resetForm }) =>
                handleFormSubmit(values, resetForm)
              }
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
                    onChangeText={(text: string) =>
                      handleChange("words")(text.replace(/\s/g, ""))
                    }
                    onBlur={handleBlur("words")}
                  />
                  <BottomTextWhite>{text}</BottomTextWhite>
                  <GeneralButton onPress={handleSubmit}>
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