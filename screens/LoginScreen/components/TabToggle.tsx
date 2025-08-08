import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface TabToggleProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabToggle: React.FC<TabToggleProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 24,
        borderRadius: 12,
        padding: 4,
      }}
    >
      <TouchableOpacity
        style={[
          {
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 8,
          },
          activeTab === "login"
            ? { backgroundColor: "#1B9AF5" }
            : { backgroundColor: "transparent" },
        ]}
        onPress={() => onTabChange("login")}
      >
        <Text
          style={[
            {
              fontSize: 14,
              fontWeight: "600",
            },
            {
              color: activeTab === "login" ? "#FFFFFF" : "#4B5563",
            },
          ]}
        >
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          {
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 8,
          },
          activeTab === "register"
            ? { backgroundColor: "#1B9AF5" }
            : { backgroundColor: "transparent" },
        ]}
        onPress={() => onTabChange("register")}
      >
        <Text
          style={[
            {
              fontSize: 14,
              fontWeight: "600",
            },
            {
              color: activeTab === "register" ? "#FFFFFF" : "#4B5563",
            },
          ]}
        >
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};
