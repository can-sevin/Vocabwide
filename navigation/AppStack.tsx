import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen, SpeechTextScreen, OcrScreen,  ResultScreen, InputScreen} from "../screens";

const Stack = createStackNavigator();

export const AppStack = ({ uid }) => {
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
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
};
