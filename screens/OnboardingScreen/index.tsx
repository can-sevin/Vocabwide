import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useTheme } from "../../providers/ThemeProvider";
import { themes } from "../../assets/themes";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Interactive Learning & Progress Tracking",
    description:
      "Improve your vocabulary with fun quizzes and track your learning journey!",
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
    title: "Add & Translate Words Easily",
    description:
      "Use text, voice, or camera to quickly add and translate unknown words!",
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
  const { theme, toggleTheme } = useTheme();
  const scrollX = useSharedValue(0);
  const scrollRef = useRef();

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const handleNext = (index) => {
    if (index < slides.length - 1) {
      scrollRef.current.scrollTo({
        x: (index + 1) * width,
        animated: true,
      });
    } else {
      navigation.navigate("Login");
    }
  };

  // 3. slide'dan sonra scroll'u devre dışı bırak
  const currentSlideIndex = Math.round(scrollX.value / width);
  const isOnLastSlide = currentSlideIndex >= 2;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Text style={{ color: theme.text }}>
          {theme === themes.light ? "Dark Mode" : "Light Mode"}
        </Text>
      </TouchableOpacity>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!isOnLastSlide}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            <ImageBackground
              source={slide.image}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              <View style={styles.overlay}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <Text style={styles.description}>{slide.description}</Text>
                </View>

                {index === slides.length - 1 && (
                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => handleNext(index)}
                  >
                    <Text style={styles.continueButtonText}>Continue</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ImageBackground>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const opacity = interpolate(
              scrollX.value,
              [(index - 1) * width, index * width, (index + 1) * width],
              [0.4, 1, 0.4],
              Extrapolate.CLAMP
            );

            const scale = interpolate(
              scrollX.value,
              [(index - 1) * width, index * width, (index + 1) * width],
              [1, 1.4, 1],
              Extrapolate.CLAMP
            );

            return {
              opacity,
              transform: [{ scale }],
            };
          });

          // 4. slide'da Continue butonu çıkınca indicator'ları gizle
          const currentSlideIndex = Math.round(scrollX.value / width);
          const isLastSlide = currentSlideIndex >= 3;
          return !isLastSlide ? (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                animatedStyle,
                {
                  backgroundColor:
                    index === 0 ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                },
              ]}
            />
          ) : null;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
  },
  slide: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    paddingBottom: 100,
  },
  textContainer: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "left",
    marginBottom: 15,
    lineHeight: 36,
  },
  description: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "left",
    lineHeight: 24,
    opacity: 0.9,
  },
  continueButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 40,
    height: 40,
    borderRadius: 8,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    width: "100%",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
