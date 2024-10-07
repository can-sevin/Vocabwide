import React, { useState } from "react";
import { TouchableOpacity, ImageBackground, Keyboard } from "react-native";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { TextInput, FormErrorMessage, LoadingIndicator } from "../../components";
import { Images } from "../../config";
import { useTogglePasswordVisibility } from "../../hooks/useTogglePasswordVisibility";
import { signupValidationSchema } from "../../utils/index";
import { registerUser } from "../../firebase/auth";
import {
  GeneralButton,
  GeneralButtonText,
  HeaderTextSignupLayout,
  LoginBtmText,
  SignupHeaderText,
  SignupLayout,
  SignupLayoutInside,
} from "./style";

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    confirmPasswordVisibility,
    confirmPasswordIcon,
    handleConfirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const handleSignup = async (values: { username: string; email: string; password: string }) => {
    const { username, email, password } = values;
    Keyboard.dismiss();

    await registerUser(username, email, password, setLoading, setErrorState);
  };

  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }} resizeMode="cover" blurRadius={6}>
      <SignupLayout>
        <HeaderTextSignupLayout>
          <SignupHeaderText>Register</SignupHeaderText>
        </HeaderTextSignupLayout>
        <SignupLayoutInside>
          <Formik
            initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
            validationSchema={signupValidationSchema}
            onSubmit={(values) => handleSignup(values)}
          >
            {({ values, touched, errors, handleChange, handleSubmit, handleBlur }) => (
              <KeyboardAwareScrollView>
                <TextInput
                  name="username"
                  leftIconName="username"
                  placeholder="Enter username"
                  autoCapitalize="none"
                  keyboardType="default"
                  textContentType="username"
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                />
                <FormErrorMessage error={values.username !== "" && errors.username} visible={touched.username} />

                <TextInput
                  name="email"
                  leftIconName="email"
                  placeholder="Enter email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                <FormErrorMessage error={values.email !== "" && errors.email} visible={touched.email} />

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
                <FormErrorMessage error={values.password !== "" && errors.password} visible={touched.password} />

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
                  error={values.confirmPassword !== "" && errors.confirmPassword}
                  visible={touched.confirmPassword}
                />

                {errorState !== "" ? <FormErrorMessage error={errorState} visible={true} /> : null}

                {loading ? (
                  <LoadingIndicator />
                ) : (
                  <GeneralButton onPress={() => handleSubmit()}>
                    <GeneralButtonText>Signup</GeneralButtonText>
                  </GeneralButton>
                )}
              </KeyboardAwareScrollView>
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