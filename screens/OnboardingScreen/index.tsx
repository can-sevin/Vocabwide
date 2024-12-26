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

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "🎯 Kişiselleştirilmiş Kelime Önerileri",
    description:
      "Öğrenme hedeflerinize göre özelleştirilmiş kelime önerileri alın.",
    image: require("../../assets/slides/slide1.jpg"),
  },
  {
    id: 2,
    title: "🗣️ Ses ve Kamera Entegrasyonu",
    description: "Konuşarak veya kameranızı kullanarak yeni kelimeler ekleyin.",
    image: require("../../assets/slides/slide2.jpg"),
  },
  {
    id: 3,
    title: "🎮 İnteraktif Öğrenme Modları",
    description:
      "Oyunlar, testler ve bilgi kartları ile öğrenmeyi eğlenceli hale getirin.",
    image: require("../../assets/slides/slide3.jpg"),
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
      navigation.navigate("Home");
    }
  };

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
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            <ImageBackground
              source={slide.image}
              style={styles.backgroundImage}
            >
              <View
                style={[
                  styles.content,
                  { backgroundColor: theme.contentBackground },
                ]}
              >
                <Text style={[styles.title, { color: theme.text }]}>
                  {slide.title}
                </Text>
                <Text style={[styles.description, { color: theme.text }]}>
                  {slide.description}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: theme.buttonBackground },
                  ]}
                  onPress={() => handleNext(index)}
                >
                  <Text
                    style={[styles.buttonText, { color: theme.buttonText }]}
                  >
                    {index === slides.length - 1 ? "Başlayın" : "Next"}
                  </Text>
                </TouchableOpacity>
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

          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                animatedStyle,
                { backgroundColor: theme.indicator },
              ]}
            />
          );
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
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: height * 0.6,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    width: "100%",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});