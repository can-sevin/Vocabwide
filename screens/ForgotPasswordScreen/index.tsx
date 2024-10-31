import React, { useState } from "react";
import { ImageBackground, Keyboard } from "react-native";
import { resetPassword } from "../../firebase"; // Corrected import for resetPassword
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import {
  ForgotPasswordLayout,
  ForgotPasswordLayoutInside,
  ForgotPasswordHeaderText,
  HeaderTextForgotPasswordLayout,
} from "./styles";
import { Images } from "../../config"; // Images config

export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendPasswordResetEmail = async (values: { email: string }) => {
    const { email } = values;
    setLoading(true);
    Keyboard.dismiss();

    try {
      await resetPassword(email, setLoading, setErrorState, setSuccessMessage);
      navigation.navigate("Login");
    } catch (error) {
      setErrorState("Failed to send password reset email. Please try again.");
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
      <ForgotPasswordLayout>
        <HeaderTextForgotPasswordLayout>
          <ForgotPasswordHeaderText>
            Reset your password
          </ForgotPasswordHeaderText>
        </HeaderTextForgotPasswordLayout>
        <ForgotPasswordLayoutInside>
          <ForgotPasswordForm
            onSubmit={handleSendPasswordResetEmail}
            loading={loading}
            errorState={errorState}
            successMessage={successMessage}
            navigation={navigation}
          />
        </ForgotPasswordLayoutInside>
      </ForgotPasswordLayout>
    </ImageBackground>
  );
};
