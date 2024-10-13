import { Audio } from "expo-av";

export const Sounds = {
  correct: require("../assets/sounds/correct.mp3"),
  complete: require("../assets/sounds/exam_complete.mp3"),
  error: require("../assets/sounds/exam_error.mp3"),
  time: require("../assets/sounds/time_error.mp3"),
};

export const playSound = async (soundKey: keyof typeof Sounds) => {
  const { sound } = await Audio.Sound.createAsync(Sounds[soundKey]);
  await sound.playAsync();
};
