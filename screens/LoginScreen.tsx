import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Formik } from "formik";
import { signInWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {View, TextInput, Logo, Button, FormErrorMessage } from "../components";
import { Colors, auth } from "../config";
import { useTogglePasswordVisibility } from "../hooks";
import { loginValidationSchema } from "../utils";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height; 

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = (values) => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      setErrorState(error.message)
    );
  };

  return (
    <View style={styles.container} isSafe>
        <Text style={styles.loginTitle}>Welcome to login</Text>
        <View style={styles.container_inside}>
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
                {/* Input fields */}
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
                errorState={errorState} rightIcon={undefined} handlePasswordVisibility={undefined}                />
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
                <Button style={styles.button} onPress={handleSubmit} children={undefined} title={undefined}>
                  <Text style={styles.buttonText}>Login</Text>
                </Button>
              </KeyboardAwareScrollView>
            )}
          </Formik>
          <>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.footer_text}>Create a new account?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.footer_text}>Forgot Password</Text>
          </TouchableOpacity>
          </>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6537C5',
    justifyContent: 'space-between'
  },
  container_inside: {
    backgroundColor: Colors.whiteLight,
    borderRadius: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    height: windowHeight * 0.6 ,
    marginTop: 64,
    padding: 32,
  },
  loginTitle: {
    fontSize: 28,
    color: '#f5f5f5',
    fontFamily: 'Circular-Bold',
    alignSelf: 'center',
    marginTop: 128,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: Colors.purple,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "700",
  },
  footer_text: {
    fontFamily:'Circular-Medium', 
    fontSize: 16, 
    alignSelf: 'center', 
    marginTop: 12
  },
});
