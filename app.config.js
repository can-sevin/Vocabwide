import "dotenv/config";

export default {
  expo: {
    name: "Vocabwide",
    slug: "expo-vocabwide",
    privacy: "public",
    platforms: ["ios", "android"],
    version: "0.19.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#f3eeff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    "android": {
      "permissions": ["android.permission.RECORD_AUDIO"]
    },  
    ios: {
      supportsTablet: true,
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Vocabwide wants to microphone permission If you want to add word by voice you have to give voice permission",
        "NSSpeechRecognitionUsageDescription": "Description of why you require the use of the speech recognition"
      },
    },
    plugins: [
      [
        "@react-native-voice/voice",
      {
        "microphonePermission": "CUSTOM: Allow $(PRODUCT_NAME) to access the microphone",
        "speechRecognitionPermission": "CUSTOM: Allow $(PRODUCT_NAME) to securely recognize user speech"
      },
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
        }
      ]
  ],
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
  },
};
