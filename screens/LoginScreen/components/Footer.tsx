import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { themes } from "../../../assets/themes";

interface FooterProps {
  theme: any;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <View style={{ alignItems: "center", marginTop: 32 }}>
      <Text style={[{ fontSize: 14, color: theme.textSecondary }]}>
        By continuing, you agree to our
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity>
          <Text
            style={[
              { fontSize: 14 },
              {
                color: theme === themes.dark ? "#00A3E0" : theme.primary,
              },
            ]}
          >
            Terms of Service
          </Text>
        </TouchableOpacity>
        <Text style={[{ fontSize: 14, color: theme.textSecondary }]}> & </Text>
        <TouchableOpacity>
          <Text
            style={[
              { fontSize: 14 },
              {
                color: theme === themes.dark ? "#00A3E0" : theme.primary,
              },
            ]}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
