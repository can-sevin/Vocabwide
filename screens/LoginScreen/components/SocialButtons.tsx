import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { themes } from "../../../assets/themes";
import { Images } from "../../../config/images";

interface SocialButtonsProps {
  theme: any;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({ theme }) => {
  const socialButtons = [
    {
      icon: theme === themes.dark ? Images.google_dark : Images.google_light,
      text: "Continue with Google",
      width: 13.34,
      height: 13.56,
    },
    {
      icon: theme === themes.dark ? Images.apple_dark : Images.apple_light,
      text: "Continue with Apple",
      width: 10.5,
      height: 12.25,
    },
    {
      icon:
        theme === themes.dark ? Images.facebook_dark : Images.facebook_light,
      text: "Continue with Facebook",
      width: 14,
      height: 14,
    },
  ];

  return (
    <>
      <View style={{ marginBottom: 32 }}>
        {socialButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 20,
                borderRadius: 12,
                marginBottom: 16,
                borderWidth: 0,
                height: 45,
                backgroundColor: theme === themes.dark ? "#2E2E4A" : "#DEDEDE",
              },
            ]}
            activeOpacity={0.7}
          >
            <Image
              source={button.icon}
              style={[
                {
                  width: 14,
                  height: 14,
                  marginRight: 16,
                },
                { width: button.width, height: button.height },
              ]}
            />
            <Text style={[{ fontSize: 14, color: theme.text }]}>
              {button.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Divider */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <View
          style={[
            {
              flex: 1,
              height: 1,
            },
            { backgroundColor: theme.dividerLine },
          ]}
        />
        <Text
          style={[
            {
              fontSize: 14,
              fontFamily: "Helvetica-Regular",
              marginHorizontal: 16,
            },
            { color: theme.textSecondary },
          ]}
        >
          or
        </Text>
        <View
          style={[
            {
              flex: 1,
              height: 1,
            },
            { backgroundColor: theme.dividerLine },
          ]}
        />
      </View>
    </>
  );
};
