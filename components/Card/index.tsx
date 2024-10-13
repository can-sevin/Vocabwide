import React, { useEffect } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Images } from '../../config';
import { CardContainer, CardText, ImageBackgroundStyled } from './styles'; // Kart stil dosyası

interface CardProps {
  card: string;
  index: number;
  removing: boolean;
  originalText: string;
  updateCardText: (index: number, text: string) => void;
  resetCardText: (index: number, text: string) => void;
  removeCard: (index: number) => void;
  playSound: (soundKey: string) => void;
}

const SWIPE_THRESHOLD = 150;
const SWIPE_THRESHOLD_HEIGHT = 100;

const Card = ({
  card,
  index,
  removing,
  originalText,
  updateCardText,
  resetCardText,
  removeCard,
  playSound,
}: CardProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (removing) {
      opacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(removeCard)(index);
      });
    }
  }, [removing]);

  const triggerFadeOut = () => {
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(removeCard)(index);
    });
  };

  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      if (translateY.value < -SWIPE_THRESHOLD_HEIGHT) {
        runOnJS(updateCardText)(index, 'Up');
      } else if (translateY.value > SWIPE_THRESHOLD_HEIGHT) {
        runOnJS(updateCardText)(index, 'Down');
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        runOnJS(updateCardText)(index, 'Left');
      } else if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(updateCardText)(index, 'Right');
      }
    },
    onEnd: () => {
      if (
        translateX.value < -SWIPE_THRESHOLD ||
        translateX.value > SWIPE_THRESHOLD ||
        translateY.value < -SWIPE_THRESHOLD_HEIGHT ||
        translateY.value > SWIPE_THRESHOLD_HEIGHT
      ) {
        runOnJS(playSound)('correct');
        runOnJS(triggerFadeOut)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        runOnJS(resetCardText)(index, originalText);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <CardContainer style={animatedStyle}>
        <ImageBackgroundStyled source={Images.yellow_card} style={{ flex: 1 }}>
          <CardText>{card}</CardText>
        </ImageBackgroundStyled>
      </CardContainer>
    </PanGestureHandler>
  );
};

export default Card;