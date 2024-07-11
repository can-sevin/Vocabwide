import { useFonts } from 'expo-font';

export const Fonts = () => {
    const [fontsLoaded, fontError] = useFonts({
        'Circular-Black': require('../assets/fonts/circular-std-black.ttf'),
        'Circular-Bold': require('../assets/fonts/circular-std-bold.ttf'),
        'Circular-Medium': require('../assets/fonts/circular-std-medium.ttf'),
      });    
};
