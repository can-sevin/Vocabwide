import React from "react";
import { ActivityIndicator } from "react-native";
import { Colors } from "../../config";
import { Container } from "./style";

export const LoadingIndicator = () => {
  return (
    <Container>
      <ActivityIndicator size="large" color={Colors.main_yellow} />
    </Container>
  );
};