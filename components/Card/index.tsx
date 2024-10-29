import React, { useEffect } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { YellowCard, CardView, CardText } from './styles';
import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.08;
const SWIPE_THRESHOLD_HEIGHT = SCREEN_HEIGHT * 0.08;

export const Card = ({
  card,
  index,
  originalText,
  removing,
  updateCardText,
  resetCardText,
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
  
      const absX = Math.abs(translateX.value);
      const absY = Math.abs(translateY.value);
  
      console.log("translateX:", translateX.value, "translateY:", translateY.value);
      console.log("absX:", absX, "absY:", absY);
  
      if (absY > SWIPE_THRESHOLD_HEIGHT && absY > absX) {
        if (translateY.value < -SWIPE_THRESHOLD_HEIGHT) {
          console.log("Up swipe detected");
          runOnJS(updateCardText)(index, top);
        } else if (translateY.value > SWIPE_THRESHOLD_HEIGHT) {
          console.log("Down swipe detected");
          runOnJS(updateCardText)(index, bottom);
        }
      } else if (absX > SWIPE_THRESHOLD && absX > absY) {
        if (translateX.value < -SWIPE_THRESHOLD) {
          console.log("Left swipe detected");
          runOnJS(updateCardText)(index, left);
        } else if (translateX.value > SWIPE_THRESHOLD) {
          console.log("Right swipe detected");
          runOnJS(updateCardText)(index, right);
        }
      }
    },
    onEnd: () => {
      const absX = Math.abs(translateX.value);
      const absY = Math.abs(translateY.value);
      console.log("Final translateX:", translateX.value, "translateY:", translateY.value);
  
      const direction =
        absX > absY && absX > SWIPE_THRESHOLD ? (translateX.value > 0 ? 'right' : 'left') :
        absY > absX && absY > SWIPE_THRESHOLD_HEIGHT ? (translateY.value > 0 ? 'bottom' : 'top') :
        null;
  
      if (!direction) {
        console.log("Swipe canceled, resetting to original text");
        runOnJS(resetCardText)(index);
      } else {
        console.log("Detected swipe direction:", direction);
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