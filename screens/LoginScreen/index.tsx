import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../providers/ThemeProvider";
import { themes } from "../../assets/themes";
import { Images } from "../../config";
import { useTogglePasswordVisibility } from "../../hooks/useTogglePasswordVisibility";
import { loginUser, registerUser } from "../../firebase/auth";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "../../utils/index";
import { Formik } from "formik";
import { styles } from "./styles";

export const LoginScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("login");
  const [errorState, setErrorState] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();
  const {
    passwordVisibility: confirmPasswordVisibility,
    handlePasswordVisibility: handleConfirmPasswordVisibility,
    rightIcon: confirmRightIcon,
  } = useTogglePasswordVisibility();

  const handleLogin = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    await loginUser(email, password, setErrorState, setLoading);
  };

  const handleRegister = async (values: {
    email: string;
    reEmail: string;
    password: string;
    confirmPassword: string;
    nameSurname: string;
    birthday: string;
    dailyTarget: string;
  }) => {
    const { email, password, nameSurname } = values;
    await registerUser(nameSurname, email, password, setLoading, setErrorState);
  };

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={Images.header} style={styles.headerImage} />
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              Boost Your Vocabulary with AI
            </Text>
          </View>
          <TouchableOpacity style={styles.languageSelector}>
            <Text style={[styles.languageText, { color: theme.text }]}>
              English
            </Text>
            <Text style={[styles.chevron, { color: theme.text }]}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Login/Register Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === "login"
                ? { backgroundColor: "#1B9AF5" }
                : { backgroundColor: "#DEDEDE" },
            ]}
            onPress={() => setActiveTab("login")}
          >
            <Text
              style={[
                styles.toggleText,
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
              styles.toggleButton,
              activeTab === "register"
                ? { backgroundColor: "#1B9AF5" }
                : { backgroundColor: "#DEDEDE" },
            ]}
            onPress={() => setActiveTab("register")}
          >
            <Text
              style={[
                styles.toggleText,
                {
                  color: activeTab === "register" ? "#FFFFFF" : "#4B5563",
                },
              ]}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social Login Buttons - Only for Login */}
        {activeTab === "login" && (
          <>
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor:
                      theme === themes.dark ? "#2E2E4A" : "#DEDEDE",
                  },
                ]}
                activeOpacity={0.7}
              >
                <Image
                  source={
                    theme === themes.dark
                      ? Images.google_dark
                      : Images.google_light
                  }
                  style={[styles.socialIcon, { width: 13.34, height: 13.56 }]}
                />
                <Text style={[styles.socialText, { color: theme.text }]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor:
                      theme === themes.dark ? "#2E2E4A" : "#DEDEDE",
                  },
                ]}
                activeOpacity={0.7}
              >
                <Image
                  source={
                    theme === themes.dark
                      ? Images.apple_dark
                      : Images.apple_light
                  }
                  style={[styles.socialIcon, { width: 10.5, height: 12.25 }]}
                />
                <Text style={[styles.socialText, { color: theme.text }]}>
                  Continue with Apple
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor:
                      theme === themes.dark ? "#2E2E4A" : "#DEDEDE",
                  },
                ]}
                activeOpacity={0.7}
              >
                <Image
                  source={
                    theme === themes.dark
                      ? Images.facebook_dark
                      : Images.facebook_light
                  }
                  style={[styles.socialIcon, { width: 14, height: 14 }]}
                />
                <Text style={[styles.socialText, { color: theme.text }]}>
                  Continue with Facebook
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.dividerLine },
                ]}
              />
              <Text
                style={[styles.dividerText, { color: theme.textSecondary }]}
              >
                or
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.dividerLine },
                ]}
              />
            </View>
          </>
        )}

        {/* Login/Register Form */}
        {activeTab === "login" ? (
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={(values) => handleLogin(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => {
              const isFormValid =
                values.email !== "" &&
                values.password !== "" &&
                !errors.email &&
                !errors.password;

              return (
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === themes.light ? "#DEDEDE" : "#2E2E4A",
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="Email"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={(e) => {
                      handleBlur("email")(e);
                      setFocusedInput(null);
                    }}
                    onFocus={() => setFocusedInput("email")}
                    selectionColor={theme.text}
                    cursorColor={theme.text}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === themes.light ? "#DEDEDE" : "#2E2E4A",
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="Password"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={passwordVisibility}
                    textContentType="password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={(e) => {
                      handleBlur("password")(e);
                      setFocusedInput(null);
                    }}
                    onFocus={() => setFocusedInput("password")}
                    selectionColor={theme.text}
                    cursorColor={theme.text}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  {/* Remember Me & Forgot Password */}
                  <View style={styles.formOptions}>
                    <TouchableOpacity style={styles.rememberMe}>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor:
                              theme === themes.dark ? "#666680" : theme.border,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.rememberText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        Remember me
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ForgotPassword")}
                    >
                      <Text
                        style={[
                          styles.forgotText,
                          {
                            color:
                              theme === themes.dark ? "#00A3E0" : theme.primary,
                          },
                        ]}
                      >
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={[
                      styles.loginButton,
                      {
                        backgroundColor:
                          theme === themes.dark ? "#00A3E0" : "#1B9AF5",
                      },
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={!isFormValid || loading}
                  >
                    <Text
                      style={[styles.loginButtonText, { color: "#FFFFFF" }]}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Text>
                  </TouchableOpacity>

                  {errorState ? (
                    <Text style={styles.errorText}>{errorState}</Text>
                  ) : null}

                  {/* AI-powered Learning Card */}
                  <View
                    style={[
                      styles.aiCard,
                      {
                        backgroundColor:
                          theme === themes.dark ? "#1F2937" : "#DEDEDE",
                      },
                    ]}
                  >
                    <Image source={Images.login} style={styles.aiImage} />
                    <Text
                      style={[
                        styles.aiTitle,
                        {
                          color: theme === themes.dark ? "#FFFFFF" : theme.text,
                        },
                      ]}
                    >
                      AI-powered Learning
                    </Text>
                    <Text
                      style={[
                        styles.aiDescription,
                        {
                          color:
                            theme === themes.dark
                              ? "#9CA3AF"
                              : theme.textSecondary,
                        },
                      ]}
                    >
                      Smart suggestions and personalized learning path
                    </Text>
                  </View>
                </View>
              );
            }}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              email: "",
              reEmail: "",
              password: "",
              confirmPassword: "",
              nameSurname: "",
              birthday: "",
              dailyTarget: "",
            }}
            validationSchema={signupValidationSchema}
            onSubmit={(values) => handleRegister(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => {
              const isFormValid =
                values.email !== "" &&
                values.reEmail !== "" &&
                values.password !== "" &&
                values.confirmPassword !== "" &&
                values.nameSurname !== "" &&
                values.birthday !== "" &&
                values.dailyTarget !== "" &&
                !errors.email &&
                !errors.reEmail &&
                !errors.password &&
                !errors.confirmPassword &&
                !errors.nameSurname &&
                !errors.birthday &&
                !errors.dailyTarget;

              return (
                <View style={styles.formContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === themes.light ? "#DEDEDE" : "#2E2E4A",
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="Email"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={(e) => {
                      handleBlur("email")(e);
                      setFocusedInput(null);
                    }}
                    onFocus={() => setFocusedInput("email")}
                    selectionColor={theme.text}
                    cursorColor={theme.text}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === themes.light ? "#DEDEDE" : "#2E2E4A",
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="Re-Email"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={values.reEmail}
                    onChangeText={handleChange("reEmail")}
                    onBlur={(e) => {
                      handleBlur("reEmail")(e);
                      setFocusedInput(null);
                    }}
                    onFocus={() => setFocusedInput("reEmail")}
                    selectionColor={theme.text}
                    cursorColor={theme.text}
                  />
                  {touched.reEmail && errors.reEmail && (
                    <Text style={styles.errorText}>{errors.reEmail}</Text>
                  )}

                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === themes.light ? "#DEDEDE" : "#2E2E4A",
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="Password"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={passwordVisibility}
                    textContentType="newPassword"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={(e) => {
                      handleBlur("password")(e);
                      setFocusedInput(null);
                    }}
                    onFocus={() => setFocusedInput("password")}
                    selectionColor={theme.text}
                    cursorColor={theme.text}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === themes.light ? "#DEDEDE" : "#2E2E4A",
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="Re-Password"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={confirmPasswordVisibility}
                    textContentType="password"
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={(e) => {
                      handleBlur("confirmPassword")(e);
                      setFocusedInput(null);
                    }}
                    onFocus={() => setFocusedInput("confirmPassword")}
                    selectionColor={theme.text}
                    cursorColor={theme.text}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}

                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === themes.light ? "#DEDEDE" : "#2E2E4A",
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="Name & Surname"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="words"
                    keyboardType="default"
                    textContentType="name"
                    value={values.nameSurname}
                    onChangeText={handleChange("nameSurname")}
                    onBlur={(e) => {
                      handleBlur("nameSurname")(e);
                      setFocusedInput(null);
                    }}
                    onFocus={() => setFocusedInput("nameSurname")}
                    selectionColor={theme.text}
                    cursorColor={theme.text}
                  />
                  {touched.nameSurname && errors.nameSurname && (
                    <Text style={styles.errorText}>{errors.nameSurname}</Text>
                  )}

                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === themes.light ? "#DEDEDE" : "#2E2E4A",
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="Birthday"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                    keyboardType="default"
                    value={values.birthday}
                    onChangeText={handleChange("birthday")}
                    onBlur={(e) => {
                      handleBlur("birthday")(e);
                      setFocusedInput(null);
                    }}
                    onFocus={() => setFocusedInput("birthday")}
                    selectionColor={theme.text}
                    cursorColor={theme.text}
                  />
                  {touched.birthday && errors.birthday && (
                    <Text style={styles.errorText}>{errors.birthday}</Text>
                  )}

                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === themes.light ? "#DEDEDE" : "#2E2E4A",
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="Daily Word Target"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    value={values.dailyTarget}
                    onChangeText={handleChange("dailyTarget")}
                    onBlur={(e) => {
                      handleBlur("dailyTarget")(e);
                      setFocusedInput(null);
                    }}
                    onFocus={() => setFocusedInput("dailyTarget")}
                    selectionColor={theme.text}
                    cursorColor={theme.text}
                  />
                  {touched.dailyTarget && errors.dailyTarget && (
                    <Text style={styles.errorText}>{errors.dailyTarget}</Text>
                  )}

                  {/* Register Button */}
                  <TouchableOpacity
                    style={[
                      styles.loginButton,
                      {
                        backgroundColor:
                          theme === themes.dark ? "#4A4A67" : "#1B9AF5",
                        width: "90%",
                      },
                      !isFormValid && { opacity: 0.6 },
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={!isFormValid || loading}
                  >
                    <Text
                      style={[styles.loginButtonText, { color: "#FFFFFF" }]}
                    >
                      {loading ? "Registering..." : "Register"}
                    </Text>
                  </TouchableOpacity>

                  {errorState ? (
                    <Text style={styles.errorText}>{errorState}</Text>
                  ) : null}
                </View>
              );
            }}
          </Formik>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            By continuing, you agree to our
          </Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text
                style={[
                  styles.footerLink,
                  {
                    color: theme === themes.dark ? "#00A3E0" : theme.primary,
                  },
                ]}
              >
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              {" "}
              &{" "}
            </Text>
            <TouchableOpacity>
              <Text
                style={[
                  styles.footerLink,
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
