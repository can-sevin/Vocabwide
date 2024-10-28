import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, SignupScreen, ForgotPasswordScreen } from "../screens";
import { PermissionScreen } from "../screens/PermissionScreen";
import { Camera } from "expo-camera";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Colors } from "../config";
import { useCustomFonts } from "../providers/Fonts";
import { LoadingContainer } from "./style";

const Stack = createStackNavigator();

export const AuthStack = ({navigation}) => {
  const [route, setRoute] = useState<string | null>(null);
  const fontsLoaded = useCustomFonts();

  useEffect(() => {
    const checkPermissions = async () => {
      const cam = await Camera.requestCameraPermissionsAsync();
      const mic = await Audio.requestPermissionsAsync();
      const result = cam.granted && mic.granted;
      setRoute(result ? "Login" : "Permission");
    };
    checkPermissions();
  }, []);

  if (!route || !fontsLoaded) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={Colors.main_yellow} />
      </LoadingContainer>
    );
  }

  if (route === "Permission") {
    return <PermissionScreen navigation={navigation} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Permission" component={PermissionScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;