import * as ImageManipulator from 'expo-image-manipulator';
import textRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';
import { Flags } from '../config';

export const processImage = async (uri: string, mainFlag: keyof typeof Flags, setLoading: Function, setError: Function) => {
  try {
    setLoading(true);
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    const family = Flags[mainFlag].family;

    let script: TextRecognitionScript | null = null;
    switch (family) {
      case 'Chinese':
        script = TextRecognitionScript.CHINESE;
        break;
      case 'Japanese':
        script = TextRecognitionScript.JAPANESE;
        break;
      case 'Korean':
        script = TextRecognitionScript.KOREAN;
        break;
      case 'Devanagari':
        script = TextRecognitionScript.DEVANAGARI;
        break;
      case 'Latin':
        script = TextRecognitionScript.LATIN;
        break;
      default:
        setError("The language family doesn't support text recognition.");
        setLoading(false);
        return null;
    }

    const result = await textRecognition.recognize(manipulatedImage.uri, script);
    setLoading(false);
    return result.text;
  } catch (error) {
    setLoading(false);
    console.error('Text recognition failed:', error);
    return null;
  }
};