import React, { useState, useEffect } from "react";
import { ImageBackground, Keyboard, SafeAreaView, Alert, Platform } from "react-native";
import {
  BottomTextWhite,
  GeneralButton,
  GeneralButtonText,
  SignupKeyboardAvoiding,
  Container,
  HeaderText,
  BackButton,
  BackButtonImage,
  ScrollContainer,
  FormView,
} from "./styles";
import { auth, Images } from "../../config";
import { Formik } from "formik";
import { handleAddingWords } from "../../firebase/database";
import { wordValidationSchema } from "../../utils/index";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { LoadingIndicator, TextInput } from "../../components";

export const InputScreen = ({ navigation, route }) => {
  const mainFlag = route.params.main;
  const targetFlag = route.params.target;
  const adUnitId =
    Platform.OS === "android"
      ? "ca-app-pub-2210071155853586/4793147397"
      : "ca-app-pub-2210071155853586/1045474070";

  const [text, setText] = useState<string>(
    "If you want to add multiple words, please separate each word with a comma."
  );
  const [wordsList, setWordsList] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [pendingWords, setPendingWords] = useState<string | null>(null); // Reklam sonrası işlenecek kelimeler
  const [adLoaded, setAdLoaded] = useState(false);

  // Rewarded Ad tanımı
  const rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {
    // Reklamı yükle
    rewardedAd.load();

    const onAdLoaded = () => {
      console.log("Rewarded Ad loaded.");
      setAdLoaded(true);
    };

    const onEarnedReward = async () => {
      console.log("User earned reward.");

      if (pendingWords) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;

          console.log("Adding pending words:", pendingWords);

          // Veritabanına kelimeleri ekle
          await handleAddingWords(
            userId,
            mainFlag,
            targetFlag,
            pendingWords,
            setText,
            setWordsList,
            setLoading
          );

          // Kelime ekleme işlemi tamamlandı
          setPendingWords(null);
        }
      } else {
        console.log("No pending words to process.");
      }

      rewardedAd.load(); // Reklamı yeniden yükle
      setAdLoaded(false);
    };

    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      onAdLoaded
    );

    const unsubscribeEarnedReward = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      onEarnedReward
    );

    return () => {
      unsubscribeLoaded();
      unsubscribeEarnedReward();
    };
  }, [pendingWords]);

  const handleFormSubmit = async (
    values: { words: string },
    resetForm: () => void
  ) => {
    const { words } = values;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }

    Keyboard.dismiss();

    // Girilen kelimeleri temizle
    const formattedWords = words
      .split(",")
      .map((word) => word.trim())
      .filter((word) => word !== "");

    if (formattedWords.length === 0) {
      setText("Please enter valid words separated by commas.");
      return;
    }

    if (!adLoaded) {
      Alert.alert(
        "Ad Loading",
        "The ad is still loading. Please try again in a few seconds."
      );
      rewardedAd.load();
      return;
    }

    // Reklam sonrası işlenecek kelimeleri ata
    setPendingWords(formattedWords.join(" "));

    // Reklamı göster
    rewardedAd.show();

    // Formu sıfırla
    resetForm();
  };

  return (
    <ImageBackground
      source={Images.background}
      style={{ flex: 1 }}
      resizeMode="cover"
      blurRadius={6}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <BackButton onPress={() => navigation.goBack()}>
            <BackButtonImage source={Images.back_icon} />
          </BackButton>
          <HeaderText>Input Page</HeaderText>
          <FormView>
            <Formik
              initialValues={{ words: "" }}
              validationSchema={wordValidationSchema}
              onSubmit={(values, { resetForm }) =>
                handleFormSubmit(values, resetForm)
              }
            >
              {({ values, handleChange, handleSubmit, handleBlur }) => (
                <SignupKeyboardAvoiding enableOnAndroid={true}>
                  <TextInput
                    name="words"
                    placeholder="Enter words"
                    autoCapitalize="none"
                    keyboardType="default"
                    autoFocus={true}
                    value={values.words}
                    onChangeText={(text) =>
                      handleChange("words")(text.replace(/\s/g, ""))
                    }
                    onBlur={handleBlur("words")}
                  />
                  <BottomTextWhite>{text}</BottomTextWhite>
                  <GeneralButton onPress={handleSubmit}>
                    <GeneralButtonText>Add Words</GeneralButtonText>
                  </GeneralButton>
                </SignupKeyboardAvoiding>
              )}
            </Formik>
            <HeaderText>Last Added Words</HeaderText>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <ScrollContainer>
                {wordsList.map((word, index) => (
                  <BottomTextWhite key={index}>{word}</BottomTextWhite>
                ))}
              </ScrollContainer>
            )}
          </FormView>
        </Container>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default InputScreen;
