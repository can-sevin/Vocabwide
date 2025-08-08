import React from "react";
import { TextInput, Text, View } from "react-native";
import { themes } from "../../../assets/themes";

interface FormInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e: any) => void;
  onFocus: () => void;
  error?: string;
  touched?: boolean;
  theme: any;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  textContentType?: string;
  autoCapitalize?: "none" | "words";
  autoCorrect?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  touched,
  theme,
  secureTextEntry = false,
  keyboardType = "default",
  textContentType,
  autoCapitalize = "none",
  autoCorrect = false,
}) => {
  return (
    <>
      <TextInput
        style={[
          {
            height: 44,
            borderWidth: 0,
            borderRadius: 12,
            paddingHorizontal: 16,
            fontSize: 14,
            fontFamily: "Helvetica-Regular",
            marginBottom: 16,
            backgroundColor: theme === themes.light ? "#DEDEDE" : "#2E2E4A",
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        textContentType={textContentType}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        onFocus={onFocus}
        selectionColor={theme.text}
        cursorColor={theme.text}
        secureTextEntry={secureTextEntry}
        autoCorrect={autoCorrect}
      />
      {touched && error && (
        <Text style={{ fontSize: 14, color: "#EF4444", marginBottom: 8 }}>
          {error}
        </Text>
      )}
    </>
  );
};
