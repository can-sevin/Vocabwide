import React from "react";
import { View, Image } from "react-native";
import { Images } from "../../../config";

interface HeaderProps {
  theme: any;
}

export const Header: React.FC<HeaderProps> = ({ theme }) => {
  return (
    <View style={{ marginBottom: 32 }}>
      <View style={{ alignItems: "flex-start" }}>
        <Image source={Images.header} style={{ width: 136, height: 36 }} />
      </View>
    </View>
  );
};
