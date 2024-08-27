import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Image, SafeAreaView, Text, View, ScrollView, Platform, TouchableOpacity, ImageBackground, Pressable } from "react-native";
import { Colors } from "../config";
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechVolumeChangeEvent,
} from "@react-native-voice/voice";
import LottieView from 'lottie-react-native';
import { HomeBtmView } from "../styles/HomeScreen";
import { background } from "./HomeScreen";
import Animated, { FadeInDown, interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

type Props = {
  navigation: any;
};

export const SpeechTextScreen = ({ navigation }) => {
  const mic_icon = require("../assets/icons/new_mic_permission.png");
  const cam_icon = require("../assets/icons/new_cam_permission.png");

  const [recognized, setRecognized] = useState("");
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState("");
  const [started, setStarted] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [partialResults, setPartialResults] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [end, setEnd] = useState("");
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    const onSpeechStart = (e: any) => {
      console.log("onSpeechStart: ", e);
      animationRef.current?.play();
      setStarted("√");
    };

    const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
      console.log("onSpeechRecognized: ", e);
      setRecognized("√");
    };

    const onSpeechEnd = (e: any) => {
      console.log("onSpeechEnd: ", e);
      animationRef.current?.pause();
      setEnd("√");
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
      console.log("onSpeechError: ", e);
      animationRef.current?.pause();
      setError(JSON.stringify(e.error));
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
      console.log("onSpeechResults: ", e);
      animationRef.current?.pause();
      const words = e.value ? e.value[0].split(" ") : [];
      setResults(words);
    };
    
    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      console.log("onSpeechPartialResults: ", e);
      animationRef.current?.pause();
      const words = e.value ? e.value[0].split(" ") : [];
      setPartialResults(words);
    };

    const onSpeechVolumeChanged = (e: SpeechVolumeChangeEvent) => {
      console.log("onSpeechVolumeChanged: ", e);
      setPitch(e.value);
    };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const _startRecognizing = async () => {
    setRecognized("");
    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");

    try {
      await Voice.start("en-US");
      if (Platform.OS === 'ios') {
        setTimeout(() => {
          Voice.stop();
        }, 5000);
      }  
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setRecognized("");
    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");
  };

  const _pauseRecognizer = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
    setRecognized("");
    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");
  };

  const selectedWords = (result:string, index:number) => {
    setSelectedIndices((prevIndices) => {
      if (prevIndices.includes(index)) {
        // Remove index if it's already selected
        return prevIndices.filter((i) => i !== index);
      } else {
        // Add index if it's not selected
        return [...prevIndices, index];
      }
    });
      setSelected((prevWords) => [...prevWords, result]);
  }

return (
  <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
  <Animated.View style={styles.container} entering={FadeInDown.duration(2000).delay(100)}>
  <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress={() => navigation.goBack()}>
    <Text style={styles.back_button}>&lt;</Text>  
  </TouchableOpacity>
  <Text style={styles.header_text}>Add words by voice</Text>
  <Text style={styles.desc_text}>
    {end
      ? "Voice recognition is over, please press the icon"
      : "Press the button to start or stop speaking."}
  </Text>

  <TouchableOpacity
    style={styles.mic_button}
    onPress={started ? _destroyRecognizer : _startRecognizing}
  >
    <Image style={styles.mic_icon} source={mic_icon} />
  </TouchableOpacity>

  <HomeBtmView
    style={[
      styles.resultsContainer,
    ]}
  >
  {started && !end && (
    <LottieView
      source={require("../assets/recognition_new.json")}
      autoPlay
      loop
      style={styles.lottieAnimation}
    />
  )}

  {!started && !end && (
    <Text style={styles.desc_text}>Your Words came here you can add words into your vocabulary list by press.</Text>
  )}

  {results.length > 9 ? (
    <ScrollView style={styles.scrollView}>
      {results.map((result, index) => (
        end && (
        <Animated.View style={[styles.word_view, selectedIndices.includes(index) && styles.selected_word_view]} entering={FadeInDown.duration(1000).delay(0)}>
          <Pressable key={`result-${index}`} onPress={() => selectedWords(result, index)}>
          <Text style={styles.word_text}>{result}</Text>
          </Pressable>
        </Animated.View>
        )
      ))}
    </ScrollView>
  ) : (
    results.map((result, index) => (
      end && (
      <Animated.View style={[styles.word_view, selectedIndices.includes(index) && styles.selected_word_view]} entering={FadeInDown.duration(1000).delay(0)}>
        <Pressable key={`result-${index}`} onPress={() => selectedWords(result, index)}>
        <Text style={styles.word_text}>{result}</Text>
        </Pressable>
      </Animated.View>
      )
    ))
  )}
  </HomeBtmView>
  </Animated.View>
  </ImageBackground>
  );
};
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: 60,
      justifyContent: "space-between",
    },
    back_button: {
      fontSize: 32,
      marginHorizontal: 24,
      alignSelf: "flex-start",
      textAlign: "center",
      color: "#fff",
      fontFamily: "Helvetica-Bold",
    },
    header_text: {
      fontSize: 32,
      alignSelf: "center",
      textAlign: "center",
      color: "#fff",
      fontFamily: "Helvetica-Bold",
    },
    resultsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',  
      height: 280,
      justifyContent: 'space-evenly',
      width: '100%',
    },  
    desc_text: {
      fontSize: 18,
      alignSelf: "center",
      textAlign: "center",
      color: "#fff",
      fontFamily: "Helvetica-Medium",
      marginVertical: 5,
      marginTop: 52,
      marginHorizontal: 28,
    },
    word_view: {
      width: '20%',
      height: 48,
      borderRadius: 20,
      backgroundColor: Colors.LighterGray3,
      justifyContent: "center",
      marginVertical: 12,
      marginHorizontal: 8
    },
    word_text: {
      color: "#fff",
      fontSize: 12,
      textAlign: "center",
    },
    mic_button: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 80,
    },
    lottieAnimation: {
      width: 160,
      height: 320,
      alignSelf: "center",
    },  
    mic_icon: {
      width: 80,
      height: 80,
    },
    btn_next: {
      height: 48,
      width: 160,
      backgroundColor: Colors.liliac,
      borderRadius: 12,
      marginTop: 16,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
    },
    scrollView: {
      flex: 1,
      width: '100%',
      backgroundColor: Colors.whiteLight,
      height: 280,
      borderRadius: 24,
    },
    selected_word_view: {
      backgroundColor: Colors.main_light_yellow,
    },
});
  
export default SpeechTextScreen;