import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen, SpeechTextScreen, OcrScreen, InputScreen} from "../screens";
import { useCustomFonts } from "../providers/Fonts";
import { ActivityIndicator } from "react-native";
import { Colors } from "../config";
import { LoadingContainer } from "./style";

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
      initialRouteName="Home"
    >
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} uid={uid} />} 
      </Stack.Screen>
      <Stack.Screen name="Speech" component={SpeechTextScreen} />
      <Stack.Screen name="Ocr" component={OcrScreen} />
      <Stack.Screen name="Input" component={InputScreen} />
    </Stack.Navigator>
  );
};