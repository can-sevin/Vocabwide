import React from "react";
import { View, Text } from "react-native";
import { Formik } from "formik";
import { loginValidationSchema } from "../../../utils/index";
import { FormInput } from "./FormInput";
import { FormButton } from "./FormButton";
import { FormOptions } from "./FormOptions";
import { AiCard } from "./AiCard";
import { styles } from "../styles";

interface LoginFormProps {
  theme: any;
  passwordVisibility: boolean;
  onForgotPassword: () => void;
  onSubmit: (values: { email: string; password: string }) => void;
  loading: boolean;
  errorState: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  theme,
  passwordVisibility,
  onForgotPassword,
  onSubmit,
  loading,
  errorState,
}) => {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        handleSubmit,
        handleBlur,
      }) => {
        const isFormValid =
          values.email !== "" &&
          values.password !== "" &&
          !errors.email &&
          !errors.password;

        return (
          <View>
            <FormInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={(e) => handleBlur("email")(e)}
              onFocus={() => {}}
              error={errors.email}
              touched={touched.email}
              theme={theme}
              keyboardType="email-address"
              textContentType="emailAddress"
            />

            <FormInput
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={(e) => handleBlur("password")(e)}
              onFocus={() => {}}
              error={errors.password}
              touched={touched.password}
              theme={theme}
              secureTextEntry={passwordVisibility}
              textContentType="password"
            />

            <FormOptions theme={theme} onForgotPassword={onForgotPassword} />

            <FormButton
              title="Login"
              onPress={() => handleSubmit()}
              disabled={!isFormValid || loading}
              loading={loading}
              theme={theme}
              width="90%"
            />

            {errorState ? (
              <Text style={styles.errorText}>{errorState}</Text>
            ) : null}

            <AiCard theme={theme} />
          </View>
        );
      }}
    </Formik>
  );
};
