import React from "react";
import { View, Text } from "react-native";
import { Formik } from "formik";
import { signupValidationSchema } from "../../../utils/index";
import { FormInput } from "./FormInput";
import { FormButton } from "./FormButton";
import { styles } from "../styles";

interface RegisterFormProps {
  theme: any;
  passwordVisibility: boolean;
  confirmPasswordVisibility: boolean;
  onSubmit: (values: {
    email: string;
    reEmail: string;
    password: string;
    confirmPassword: string;
    nameSurname: string;
    birthday: string;
    dailyTarget: string;
  }) => void;
  loading: boolean;
  errorState: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  theme,
  passwordVisibility,
  confirmPasswordVisibility,
  onSubmit,
  loading,
  errorState,
}) => {
  return (
    <Formik
      initialValues={{
        email: "",
        reEmail: "",
        password: "",
        confirmPassword: "",
        nameSurname: "",
        birthday: "",
        dailyTarget: "",
      }}
      validationSchema={signupValidationSchema}
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
          values.reEmail !== "" &&
          values.password !== "" &&
          values.confirmPassword !== "" &&
          values.nameSurname !== "" &&
          values.birthday !== "" &&
          values.dailyTarget !== "" &&
          !errors.email &&
          !errors.reEmail &&
          !errors.password &&
          !errors.confirmPassword &&
          !errors.nameSurname &&
          !errors.birthday &&
          !errors.dailyTarget;

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
              placeholder="Re-Email"
              value={values.reEmail}
              onChangeText={handleChange("reEmail")}
              onBlur={(e) => handleBlur("reEmail")(e)}
              onFocus={() => {}}
              error={errors.reEmail}
              touched={touched.reEmail}
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
              textContentType="newPassword"
            />

            <FormInput
              placeholder="Re-Password"
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              onBlur={(e) => handleBlur("confirmPassword")(e)}
              onFocus={() => {}}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              theme={theme}
              secureTextEntry={confirmPasswordVisibility}
              textContentType="password"
            />

            <FormInput
              placeholder="Name & Surname"
              value={values.nameSurname}
              onChangeText={handleChange("nameSurname")}
              onBlur={(e) => handleBlur("nameSurname")(e)}
              onFocus={() => {}}
              error={errors.nameSurname}
              touched={touched.nameSurname}
              theme={theme}
              textContentType="name"
              autoCapitalize="words"
            />

            <FormInput
              placeholder="Birthday"
              value={values.birthday}
              onChangeText={handleChange("birthday")}
              onBlur={(e) => handleBlur("birthday")(e)}
              onFocus={() => {}}
              error={errors.birthday}
              touched={touched.birthday}
              theme={theme}
            />

            <FormInput
              placeholder="Daily Word Target"
              value={values.dailyTarget}
              onChangeText={handleChange("dailyTarget")}
              onBlur={(e) => handleBlur("dailyTarget")(e)}
              onFocus={() => {}}
              error={errors.dailyTarget}
              touched={touched.dailyTarget}
              theme={theme}
              keyboardType="numeric"
            />

            <FormButton
              title="Register"
              onPress={() => handleSubmit()}
              disabled={!isFormValid || loading}
              loading={loading}
              theme={theme}
              width="90%"
            />

            {errorState ? (
              <Text style={styles.errorText}>{errorState}</Text>
            ) : null}
          </View>
        );
      }}
    </Formik>
  );
};
