import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen, SpeechTextScreen, OcrScreen, InputScreen} from "../screens";
import { useCustomFonts } from "../providers/Fonts";
import { ActivityIndicator } from "react-native";
import { Colors } from "../config";
import { LoadingContainer } from "./style";
import QuestionScreen from "../screens/QuestionScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Onboarding from "../screens/OnboardingScreen";

const Stack = createStackNavigator();

export const AppStack = ({ uid }) => {
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={Colors.main_yellow} />
      </LoadingContainer>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Onboarding"
    >
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} uid={uid} />}
      </Stack.Screen>
      <Stack.Screen name="Onboarding">
        {(props) => <Onboarding {...props} uid={uid} />}
      </Stack.Screen>
      <Stack.Screen name="Speech" component={SpeechTextScreen} />
      <Stack.Screen name="Ocr" component={OcrScreen} />
      <Stack.Screen name="Input" component={InputScreen} />
      <Stack.Screen name="Question" component={QuestionScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};