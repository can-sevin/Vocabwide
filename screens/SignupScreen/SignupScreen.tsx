import React, { useState } from "react";
import { TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { Formik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

import { TextInput, FormErrorMessage, LoadingIndicator } from "../../components";
import { auth, database } from "../../config/firebase";
import { useTogglePasswordVisibility } from "../../hooks";
import { signupValidationSchema } from "../../utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Images } from "../../config";
import { GeneralButton, GeneralButtonText, LoginBtmText, SignupHeaderText, SignupLayout, SignupLayoutInside } from "./SignupScreen.style";

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const handleSignup = async (values: { username: string, email: string; password: string; confirmPassword?: string; }) => {
    const { username, email, password } = values;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, `users/${user.uid}`), {
        username: username,
        email: user.email,
        uid: user.uid,
        words: null,
      });

      setLoading(false);
    } catch (error) {
      setErrorState(error);
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }} resizeMode="cover" blurRadius={6}>
      <SignupLayout>
        <SignupHeaderText>Register</SignupHeaderText>
        <SignupLayoutInside>
          <Formik
            initialValues={{
              username: "",
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
              <KeyboardAwareScrollView>
                <TextInput
                  name="username"
                  leftIconName="username"
                  placeholder="Enter username"
                  autoCapitalize="none"
                  keyboardType="default"
                  textContentType="username"
                  autoFocus={true}
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                />
                <FormErrorMessage error={errors.username} visible={touched.username} />
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
                <FormErrorMessage error={errors.password} visible={touched.password} />
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
                <FormErrorMessage error={errors.confirmPassword} visible={touched.confirmPassword} />
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
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
