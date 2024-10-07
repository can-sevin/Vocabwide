import { useFonts } from "expo-font";

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    "Helvetica-Medium": require("../assets/fonts/helvetica-neue-medium.ttf"),
    "Helvetica-Bold": require("../assets/fonts/helvetica-neue-bold.ttf"),
    "Helvetica-Light": require("../assets/fonts/helvetica-neue-light.ttf"),
  });

  return fontsLoaded;
};
