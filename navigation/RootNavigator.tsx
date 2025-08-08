import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { LoadingIndicator } from "../components";
import { auth } from "../config";
import { AuthenticatedUserContext } from "../providers";
import {
  createUserIfNotExists,
  signInAnonymouslyWithFirebase,
} from "../firebase";

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        if (authenticatedUser) {
          // Kullanıcı giriş yaptıysa, kullanıcıyı ayarla ve verilerini kontrol et
          setUser(authenticatedUser);
          await createUserIfNotExists(authenticatedUser.uid); // Kullanıcı var mı kontrol et, yoksa oluştur
          setIsLoading(false);
        } else {
          // Kullanıcı yoksa anonim giriş yap ve kullanıcıyı oluştur
          try {
            const anonymousUser = await signInAnonymouslyWithFirebase(
              setIsLoading
            );
            setUser(anonymousUser);
            await createUserIfNotExists(anonymousUser.uid); // Anonim kullanıcıyı veritabanına ekle
          } catch (error) {
            console.error("Error signing in anonymously:", error.message);
            setIsLoading(false);
          }
        }
      }
    );

    return unsubscribeAuthStateChanged; // Dinleyiciyi temizle
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};
