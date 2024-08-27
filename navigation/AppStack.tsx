import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen, SpeechTextScreen, OcrScreen } from "../screens";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator       
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Speech" component={SpeechTextScreen} />
      <Stack.Screen name="Ocr" component={OcrScreen} />
    </Stack.Navigator>
  );
};
