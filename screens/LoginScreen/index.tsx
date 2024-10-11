import React, { useState } from "react";
import {
  ImageBackground,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  TextInput,
  FormErrorMessage,
  LoadingIndicator,
} from "../../components";
import { Images } from "../../config";
import { useTogglePasswordVisibility } from "../../hooks/useTogglePasswordVisibility";
import { loginUser } from "../../firebase/auth";
import { loginValidationSchema } from "../../utils/index";
import {
  GeneralButton,
  GeneralButtonText,
  HeaderTextLoginLayout,
  LoginBtmText,
  LoginHeaderText,
  LoginLayout,
  LoginLayoutInside,
} from "./styles";

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const [loading, setLoading] = useState(false);
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = async (values: { email: string; password: string }) => {
    Keyboard.dismiss();
    const { email, password } = values;
    await loginUser(email, password, setErrorState, setLoading);
  };

  return (
    <ImageBackground
      source={Images.background}
      style={{ flex: 1 }}
      resizeMode="cover"
      blurRadius={6}
    >
      <LoginLayout>
        <HeaderTextLoginLayout>
          <LoginHeaderText>Welcome to login</LoginHeaderText>
        </HeaderTextLoginLayout>
        <LoginLayoutInside>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            validateOnBlur={true}
            validateOnChange={false}
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
                {/* Email Input */}
                <FormErrorMessage
                  error={values.email !== "" && errors.email}
                  visible={touched.email}
                />
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
                  errorState={errorState}
                  rightIcon={undefined}
                  handlePasswordVisibility={undefined}
                />
                {/* Password Input */}
                <FormErrorMessage
                  error={values.password !== "" && errors.password}
                  visible={touched.password}
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
                {/* Loading Indicator or Button */}
                {loading ? (
                  <LoadingIndicator />
                ) : (
                  <GeneralButton onPress={() => handleSubmit()}>
                    <GeneralButtonText>Login</GeneralButtonText>
                  </GeneralButton>
                )}
              </KeyboardAwareScrollView>
            )}
          </Formik>
          <>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <LoginBtmText>Create a new account?</LoginBtmText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <LoginBtmText>Forgot Password</LoginBtmText>
            </TouchableOpacity>
          </>
        </LoginLayoutInside>
      </LoginLayout>
    </ImageBackground>
  );
};
