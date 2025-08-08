import React from "react";
import { View, Text, Image } from "react-native";
import { Images } from "../../../config";
import { themes } from "../../../assets/themes";

interface AiCardProps {
  theme: any;
}

export const AiCard: React.FC<AiCardProps> = ({ theme }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderRadius: 12,
          marginTop: 24,
        },
        {
          backgroundColor: theme === themes.dark ? "#1F2937" : "#DEDEDE",
        },
      ]}
    >
      <Image
        source={Images.login}
        style={{ width: 40, height: 40, marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 4,
            },
            {
              color: theme === themes.dark ? "#FFFFFF" : theme.text,
            },
          ]}
        >
          AI-powered Learning
        </Text>
        <Text
          style={[
            {
              fontSize: 14,
            },
            {
              color: theme === themes.dark ? "#9CA3AF" : theme.textSecondary,
            },
          ]}
        >
          Smart suggestions and personalized learning path
        </Text>
      </View>
    </View>
  );
};
