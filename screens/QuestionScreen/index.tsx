import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Add & Translate Words Easily",
    description:
      "Use text, voice, or camera to quickly add and translate unknown words!",
    image: require("../../assets/slides/slide1.png"),
  },
  {
    id: 2,
    title: "Learn with AI-Powered Assistance",
    description:
      "Personalized word recommendations and smart translations tailored for you.",
    image: require("../../assets/slides/slide2.png"),
  },
  {
    id: 3,
    title: "Interactive Learning & Progress Tracking",
    description:
      "Improve your vocabulary with fun quizzes and track your learning journey!",
    image: require("../../assets/slides/slide3.png"),
  },
  {
    id: 4,
    title: "Learn Anytime, Anywhere",
    description:
      "Access your words from any device. Sync your progress and never lose your learning history!",
    image: require("../../assets/slides/slide4.png"),
  },
];

export default function Onboarding({ navigation }) {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // FlexDirection Animasyonu
  const animatedStyle = useAnimatedStyle(() => {
    const currentIndex = Math.round(scrollX.value / width);
    const flexDirection = currentIndex % 2 === 0 ? "row" : "column"; // Örnek flexDirection mantığı
    return {
      flexDirection,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            <Image
              source={slide.image}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </Animated.ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: "80%",
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "80%",
    marginBottom: 20,
    marginTop: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    margin: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: "#007BFF",
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
