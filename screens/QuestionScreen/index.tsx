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
  {
    id: 4,
    title: "🎮 İnteraktif Öğrenme Modları",
    description:
      "Oyunlar, testler ve bilgi kartları ile öğrenmeyi eğlenceli hale getirin.",
    image: require("../../assets/slides/slide4.jpg"),
  },
  {
    id: 5,
    title: "🎮 İnteraktif Öğrenme Modları",
    description:
      "Oyunlar, testler ve bilgi kartları ile öğrenmeyi eğlenceli hale getirin.",
    image: require("../../assets/slides/slide5.jpg"),
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
