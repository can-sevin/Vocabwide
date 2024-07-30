import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens";
import { SpeechTextScreen } from "../screens/SpeechTextScreen";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator       
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Speech" component={SpeechTextScreen} />
    </Stack.Navigator>
  );
};
