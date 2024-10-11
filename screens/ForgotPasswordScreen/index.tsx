import React, { useState } from "react";
import { ImageBackground, Keyboard } from "react-native";
import { sendPasswordReset } from "../../firebase/auth"; // Import from the firebase folder
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

  const handleSendPasswordResetEmail = async (values: { email: string }) => {
    const { email } = values;
    setLoading(true);
    Keyboard.dismiss();

    try {
      await sendPasswordReset(email); // Use the service
      navigation.navigate("Login");
    } catch (error) {
      setErrorState(error.message);
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
            navigation={navigation}
          />
        </ForgotPasswordLayoutInside>
      </ForgotPasswordLayout>
    </ImageBackground>
  );
};
