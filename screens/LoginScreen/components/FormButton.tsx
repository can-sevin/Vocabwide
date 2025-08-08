import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { themes } from "../../../assets/themes";

interface FormButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  theme: any;
  width?: string;
}

export const FormButton: React.FC<FormButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  theme,
  width = "100%",
}) => {
  const getButtonColor = () => {
    if (theme === themes.dark) {
      return title.toLowerCase() ? "#00A3E0" : "#4A4A67";
    }
    return "#1B9AF5";
  };

  return (
    <TouchableOpacity
      style={[
        {
          height: 45,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          marginBottom: 20,
          backgroundColor: getButtonColor(),
          width,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          {
            fontSize: 14,
            fontWeight: "600",
            color: "#FFFFFF",
            fontFamily: "Helvetica-Bold",
          },
        ]}
      >
        {loading ? `${title}...` : title}
      </Text>
    </TouchableOpacity>
  );
};
