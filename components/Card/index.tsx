import React, { useEffect } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { YellowCard, CardView, CardText } from './styles';
import { Images } from '../../config';
import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.15;
const SWIPE_THRESHOLD_HEIGHT = SCREEN_HEIGHT * 0.1;

export const Card = ({ card, index, removing, originalText, updateCardText, resetCardText, removeCard, playSound }) => {
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

  const triggerFadeOut = (index: number) => {
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
        runOnJS(playSound)("correct");
        runOnJS(triggerFadeOut)(index);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        runOnJS(resetCardText)(index, originalText);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <CardView style={animatedStyle}>
        <YellowCard source={Images.yellow_card} imageStyle={styles.imageStyle}>
          <CardText>{card}</CardText>
        </YellowCard>
      </CardView>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    borderRadius: 12,
  },
});