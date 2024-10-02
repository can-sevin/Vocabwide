import React, { useState } from "react";
import { ImageBackground, Keyboard, TouchableOpacity, View } from "react-native";
import { Formik } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";

import { passwordResetSchema } from "../../utils";
import { auth, Images } from "../../config";
import { TextInput, FormErrorMessage, LoadingIndicator } from "../../components";
import {
  GeneralButton,
  GeneralButtonText,
  ForgotPasswordHeaderText,
  ForgotPasswordLayout,
  ForgotPasswordLayoutInside,
  ForgotPasswordBtmText,
  HeaderTextForgotPasswordLayout
} from "./ForgotPasswordScreen.styles";

export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendPasswordResetEmail = async (values: { email: string }) => {
    const { email } = values;
    setLoading(true);
    Keyboard.dismiss();

    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Success: Password Reset Email sent.");
      navigation.navigate("Login");
      setLoading(false);
    } catch (error) {
      setErrorState(error.message);
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }} resizeMode="cover" blurRadius={6}>
      <ForgotPasswordLayout>
        <HeaderTextForgotPasswordLayout>
          <ForgotPasswordHeaderText>Reset your password</ForgotPasswordHeaderText>
        </HeaderTextForgotPasswordLayout>
        <ForgotPasswordLayoutInside>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={passwordResetSchema}
            onSubmit={(values) => handleSendPasswordResetEmail(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => (
              <>
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
                <FormErrorMessage error={errors.email} visible={touched.email} />
                
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                
                {loading ? (
                  <LoadingIndicator />
                ) : (
                  <View>
                  <GeneralButton onPress={() => handleSubmit()}>
                    <GeneralButtonText>Send Reset Email</GeneralButtonText>
                  </GeneralButton>
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <ForgotPasswordBtmText>Go back to Login</ForgotPasswordBtmText>
                  </TouchableOpacity>
                  </View>                
                )}
              </>
            )}
          </Formik>
        </ForgotPasswordLayoutInside>
      </ForgotPasswordLayout>
    </ImageBackground>
  );
};