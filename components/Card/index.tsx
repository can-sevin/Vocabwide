import React, { useEffect } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { YellowCard, CardView, CardText } from './styles';
import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.1;
const SWIPE_THRESHOLD_HEIGHT = SCREEN_HEIGHT * 0.07;

export const Card = ({
  card,
  index,
  originalText,
  removing,
  updateCardText,
  resetCardText,
  removeCard,
  playSound,
  isCorrect,
  top,
  bottom,
  left,
  right
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const backgroundColor = useSharedValue('rgba(255,255,255,1)');

  useEffect(() => {
    if (removing) {
      backgroundColor.value = withTiming('rgba(0, 0, 0, 0)', { duration: 300 });
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }
  }, [removing]);

  const handleSwipe = (direction: any) => {
    const isAnswerCorrect = isCorrect(direction);
    if (isAnswerCorrect) {
      backgroundColor.value = withTiming('rgba(0, 255, 0, 1)', { duration: 300 });
      runOnJS(playSound)('correct');
      setTimeout(() => {
        runOnJS(resetCardText)(index, originalText);
      }, 1000);
    } else {
      backgroundColor.value = withTiming('rgba(255, 0, 0, 1)', { duration: 300 });
      runOnJS(playSound)('error');
      setTimeout(() => {
        backgroundColor.value = withTiming('rgba(255,255,255,1)', { duration: 300 });
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        runOnJS(resetCardText)(index, originalText);
      }, 500);
    }
  };
    
  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      if (translateY.value < -SWIPE_THRESHOLD_HEIGHT) {
        runOnJS(updateCardText)(index, top);
      } else if (translateY.value > SWIPE_THRESHOLD_HEIGHT) {
        runOnJS(updateCardText)(index, bottom);
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        runOnJS(updateCardText)(index, left);
      } else if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(updateCardText)(index, right);
      }
    },
    onEnd: () => {
      const direction =
        translateX.value > 0 ? 'right' :
        translateX.value < 0 ? 'left' :
        translateY.value > 0 ? 'down' : 'up';
  
      if (
        Math.abs(translateX.value) < SWIPE_THRESHOLD &&
        Math.abs(translateY.value) < SWIPE_THRESHOLD_HEIGHT
      ) {
        console.log('onEnd', originalText);
        runOnJS(resetCardText)(index, originalText);
      } else {
        runOnJS(handleSwipe)(direction);
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    backgroundColor: backgroundColor.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <CardView style={animatedStyle}>
        <YellowCard style={styles.card}>
          <CardText>{card}</CardText>
        </YellowCard>
      </CardView>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.3,
    borderRadius: 12,
  },
});