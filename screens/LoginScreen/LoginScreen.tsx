import React, { useState } from "react";
import { ImageBackground, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import { signInWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {TextInput, FormErrorMessage } from "../../components";
import { auth, Images } from "../../config";
import { useTogglePasswordVisibility } from "../../hooks";
import { loginValidationSchema } from "../../utils";
import { GeneralButton, GeneralButtonText, LoginBtmText, LoginHeaderText, LoginLayout, LoginLayoutInside } from "./LoginScreen.styles";


export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } = useTogglePasswordVisibility();

  const handleLogin = (values: { email: any; password: any; }) => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      setErrorState(error.message)
    );
  };

  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }} resizeMode="cover" blurRadius={6}>
    <LoginLayout>
        <LoginHeaderText>Welcome to login</LoginHeaderText>
        <LoginLayoutInside>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginValidationSchema}
            onSubmit={(values) => handleLogin(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => (
              <KeyboardAwareScrollView>
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
                errorState={errorState} rightIcon={undefined} handlePasswordVisibility={undefined}                
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                <TextInput
                  name="password"
                  leftIconName="key-variant"
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType="password"
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  errorState={errorState}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                {/* Display Screen Error Messages */}
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                {/* Login button */}
                <GeneralButton onPress={() => handleSubmit()}>
                  <GeneralButtonText>Login</GeneralButtonText>
                </GeneralButton>
              </KeyboardAwareScrollView>
            )}
          </Formik>
          <>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <LoginBtmText>Create a new account?</LoginBtmText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <LoginBtmText>Forgot Password</LoginBtmText>
          </TouchableOpacity>
          </>
        </LoginLayoutInside>
    </LoginLayout>
    </ImageBackground>
  );
};