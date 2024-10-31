import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import { passwordResetSchema } from "../../utils/index";
import {
  TextInput,
  FormErrorMessage,
  LoadingIndicator,
} from "../../components";
import {
  GeneralButton,
  GeneralButtonText,
  ForgotPasswordBtmText,
} from "./styles";

type ForgotPasswordFormProps = {
  onSubmit: (values: { email: string }) => void;
  loading: boolean;
  errorState: string;
  successMessage: string; // Add successMessage to the props
  navigation: any;
};

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading,
  errorState,
  successMessage, // Destructure successMessage
  navigation,
}) => (
  <Formik
    initialValues={{ email: "" }}
    validationSchema={passwordResetSchema}
    onSubmit={onSubmit}
  >
    {({ values, touched, errors, handleChange, handleSubmit, handleBlur }) => (
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

        {errorState !== "" && (
          <FormErrorMessage error={errorState} visible={true} />
        )}

        {successMessage !== "" && (
          <FormErrorMessage error={successMessage} visible={true} />
        )}

        {loading ? (
          <LoadingIndicator />
        ) : (
          <View>
            <GeneralButton onPress={handleSubmit}>
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
);