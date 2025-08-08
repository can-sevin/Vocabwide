import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { themes } from "../../../assets/themes";

interface FormOptionsProps {
  theme: any;
  onForgotPassword: () => void;
}

export const FormOptions: React.FC<FormOptionsProps> = ({
  theme,
  onForgotPassword,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={[
            {
              width: 16,
              height: 16,
              borderWidth: 1,
              borderRadius: 4,
              marginRight: 8,
            },
            {
              borderColor: theme === themes.dark ? "#666680" : theme.border,
            },
          ]}
        />
        <Text style={[{ fontSize: 14, color: theme.textSecondary }]}>
          Remember me
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onForgotPassword}>
        <Text
          style={[
            { fontSize: 14 },
            {
              color: theme === themes.dark ? "#00A3E0" : theme.primary,
            },
          ]}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
};
