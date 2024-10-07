import React, { useRef } from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import { Colors } from "../config";
import LottieView from "lottie-react-native";

export const SplashScreen = ({ navigation }) => {
  const animationRef = useRef<LottieView>(null);

  return (
    <SafeAreaView style={styles.container}>
      <LottieView
        source={require("../../assets/lotties/splash_anim_logo.json")}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.pink_light,
  },
  lottieAnimation: {
    width: 400,
    height: 160,
    alignSelf: "center",
  },
});
