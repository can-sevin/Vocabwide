import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, SignupScreen, ForgotPasswordScreen } from "../screens";
import { PermissionScreen } from "../screens/PermissionScreen";
import { Camera } from "expo-camera";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { SpeechTextScreen } from "../screens/SpeechTextScreen";

const Stack = createStackNavigator();

export const AuthStack = () => {
  const [route, setRoute] = useState("");

  useEffect(() => {
    const checkPermissions = async () => {
      const cam = await Camera.requestCameraPermissionsAsync();
      const mic = await Audio.requestPermissionsAsync();
      const result = cam.granted && mic.granted;
      setRoute(result ? 'Login' : 'Permission');
    };

    checkPermissions();
  }, []);

  if (!route) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={route}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Permission" component={PermissionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Speech" component={SpeechTextScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthStack;