import React, { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import { useTheme } from "../../providers/ThemeProvider";
import { themes } from "../../assets/themes";
import { useTogglePasswordVisibility } from "../../hooks/useTogglePasswordVisibility";
import { styles } from "./styles";

// Components
import { Header } from "./components/Header";
import { TabToggle } from "./components/TabToggle";
import { SocialButtons } from "./components/SocialButtons";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Footer } from "./components/Footer";

// Hooks
import { useLoginForm } from "./hooks/useLoginForm";

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("login");
  const { passwordVisibility } = useTogglePasswordVisibility();
  const { passwordVisibility: confirmPasswordVisibility } =
    useTogglePasswordVisibility();

  const { errorState, loading, handleLogin, handleRegister } = useLoginForm();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor:
              theme === themes.dark ? "#1A1A2E" : theme.background,
          },
        ]}
        contentContainerStyle={styles.scrollContent}
      >
        <Header theme={theme} />

        <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Social Login Buttons - Only for Login */}
        {activeTab === "login" && <SocialButtons theme={theme} />}

        {/* Login/Register Form */}
        {activeTab === "login" ? (
          <LoginForm
            theme={theme}
            passwordVisibility={passwordVisibility}
            onForgotPassword={() => navigation.navigate("ForgotPassword")}
            onSubmit={handleLogin}
            loading={loading}
            errorState={errorState}
          />
        ) : (
          <RegisterForm
            theme={theme}
            passwordVisibility={passwordVisibility}
            confirmPasswordVisibility={confirmPasswordVisibility}
            onSubmit={handleRegister}
            loading={loading}
            errorState={errorState}
          />
        )}

        <Footer theme={theme} />

        {/* Theme Toggle */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Text style={[styles.themeToggleText, { color: theme.text }]}>
            {theme === themes.light ? "🌙" : "☀️"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
