import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";
import { AuthenticatedUserContext } from "../providers";
import { LoadingIndicator } from "../components";
import { auth } from "../config";

import { useFonts } from 'expo-font';

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  
  const [fontsLoaded, fontError] = useFonts({
    'Circular-Black': require('../assets/fonts/circular-std-black.ttf'),
    'Circular-Bold': require('../assets/fonts/circular-std-bold.ttf'),
    'Circular-Medium': require('../assets/fonts/circular-std-medium.ttf'),
    'Helvetica-Medium': require('../assets/fonts/helvetica-neue-medium.ttf'),
    'Helvetica-Bold': require('../assets/fonts/helvetica-neue-bold.ttf'),
    'Helvetica-Light': require('../assets/fonts/helvetica-neue-light.ttf'),
  });    

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      {!user ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
};