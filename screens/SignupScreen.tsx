import React, { useState } from "react";
import { TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { Formik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { TextInput, FormErrorMessage } from "../components";
import { auth } from "../config";
import { useTogglePasswordVisibility } from "../hooks";
import { signupValidationSchema } from "../utils";
import { GeneralButton, GeneralButtonText, LoginBtmText, SignupHeaderText, SignupKeyboardAvoiding, SignupLayout, SignupLayoutInside } from "../styles/HomeScreen";
import { background } from "./HomeScreen";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height; 

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const handleSignup = async (values: { email: any; password: any; confirmPassword?: string; }) => {
    const { email, password } = values;

    createUserWithEmailAndPassword(auth, email, password).catch((error) =>
      setErrorState(error.message)
    );
  };

  return (
    <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
    <SignupLayout>
      <SignupHeaderText>Register</SignupHeaderText>
      <SignupLayoutInside>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signupValidationSchema}
          onSubmit={(values) => handleSignup(values)}
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
                name="email"
                leftIconName="email"
                placeholder="Enter email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />
              <TextInput
                name="password"
                leftIconName="key-variant"
                placeholder="Enter password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType="newPassword"
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
              />
              <FormErrorMessage
                error={errors.password}
                visible={touched.password}
              />
              <TextInput
                name="confirmPassword"
                leftIconName="key-variant"
                placeholder="Re-Enter password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType="password"
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={touched.confirmPassword}
              />
              {/* Display Screen Error Messages */}
              {errorState !== "" ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}
              {/* Signup button */}
              <GeneralButton onPress={() => handleSubmit()}>
                <GeneralButtonText>Signup</GeneralButtonText>
              </GeneralButton>
            </SignupKeyboardAvoiding>
          )}
        </Formik>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <LoginBtmText>Already have an account?</LoginBtmText>
        </TouchableOpacity>
        </SignupLayoutInside>
    </SignupLayout>
    </ImageBackground>
  );
};