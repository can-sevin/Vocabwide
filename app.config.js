import "dotenv/config";

export default {
  expo: {
    name: "Vocabwide",
    slug: "expo-vocabwide",
    privacy: "public",
    platforms: ["ios", "android"],
    version: "0.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    jsEngine: "hermes",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#f3eeff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    android: {
      permissions: [
        "android.permission.RECORD_AUDIO",
        "CAMERA",
        "WRITE_EXTERNAL_STORAGE",
      ],
      package: "com.vocabwide",
      versionCode: 1,
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.canblack.vocabwide",
      buildNumber: "1",
      infoPlist: {
        NSMicrophoneUsageDescription:
          "Vocabwide needs microphone access to add words by voice. Please grant permission.",
        NSSpeechRecognitionUsageDescription:
          "Vocabwide uses speech recognition to convert your speech to text for word addition.",
      },
    },
    plugins: [
      [
        "@react-native-voice/voice",
        {
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access the microphone for voice input.",
          speechRecognitionPermission:
            "Allow $(PRODUCT_NAME) to securely recognize user speech.",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera.",
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone for audio recording.",
          recordAudioAndroid: true,
        },
      ],
    ],
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      eas: {
        projectId: "b3768cf0-e4fd-4f49-9c62-6c4a43e49e11",
      },
    },
  },
};