import React from "react";
import { Image, StyleSheet } from "react-native";

import { Images } from "../config";

export const Logo = ({ uri }) => {
  return <Image source={uri} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: 48,
    height: 48,
    alignSelf: "flex-start",
    margin: 12,
  },
});
