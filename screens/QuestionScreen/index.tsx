import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Dimensions, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { BackButtonContainer, BackButtonIcon, ModalText } from './style';
import { Images } from '../../config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.2;
const SWIPE_THRESHOLD_HEIGHT = SCREEN_HEIGHT * 0.15;
const AnimatedText = Animated.createAnimatedComponent(Text);

const Card = ({ card, index, originalText, updateCardText, resetCardText, removeCard }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const triggerBounce = () => {
    scale.value = withTiming(1.1, {
      duration: 150,
      easing: Easing.bounce,
    }, () => {
      scale.value = withTiming(1, { duration: 150 });
    });
  };

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
        runOnJS(triggerBounce)();
      } else if (translateY.value > SWIPE_THRESHOLD_HEIGHT) {
        runOnJS(updateCardText)(index, 'Down');
        runOnJS(triggerBounce)();
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        runOnJS(updateCardText)(index, 'Left');
        runOnJS(triggerBounce)();
      } else if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(updateCardText)(index, 'Right');
        runOnJS(triggerBounce)();
      }
    },
    onEnd: () => {
      if (translateX.value < -SWIPE_THRESHOLD || translateX.value > SWIPE_THRESHOLD ||
          translateY.value < -SWIPE_THRESHOLD_HEIGHT || translateY.value > SWIPE_THRESHOLD_HEIGHT) {
        runOnJS(triggerFadeOut)(index);
      } else {
        runOnJS(resetCardText)(index, originalText);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.cardText}>{card}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

export const SwipeableStack = ({navigation}) => {
  const [cards, setCards] = useState([
    'Card 1',
    'Card 2',
    'Card 3',
    'Card 4',
    'Card 5',
    'Card 6',
    'Card 7',
  ]);

  const time = useSharedValue(7);

  useEffect(() => {
    time.value = withTiming(0, {
      duration: 7000,
      easing: Easing.linear,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(time.value, [0, 7], [1, 1.2]) }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(time.value, [0, 7], [1, 0]),
    };
  });
  const updateCardText = (index: number, direction: string) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[index] = direction;
      return updatedCards;
    });
  };

  const resetCardText = (index: number, originalText: string) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[index] = originalText;
      return updatedCards;
    });
  };

  const removeCard = (index: number) => {
    setCards((prevCards) => prevCards.filter((_, i) => i !== index));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BackButtonContainer onPress={() => navigation.goBack()}>
        <BackButtonIcon source={Images.back_icon} />
      </BackButtonContainer>
      <Animated.View style={[styles.timerContainer, animatedStyle]}>
      <Animated.Text style={[styles.timerText, animatedTextStyle]}>
        {Math.ceil(time.value)} {/* Countdown text from 7 to 0 */}
      </Animated.Text>
    </Animated.View>
      <View style={styles.questionContainer}>
        <ModalText>Questionnaire: Please swipe the cards as required.</ModalText>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.backgroundLayer} />
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            index={index}
            originalText={`Card ${index + 1}`}
            updateCardText={updateCardText}
            resetCardText={resetCardText}
            removeCard={removeCard}
          />
        ))}

        <View style={styles.topView}>
          <Text style={styles.text}>Top</Text>
        </View>
        <View style={styles.bottomView}>
          <Text style={styles.text}>Bottom</Text>
        </View>
        <View style={styles.leftView}>
          <Text style={styles.leftText}>Left</Text>
        </View>
        <View style={styles.rightView}>
          <Text style={styles.rightText}>Right</Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionContainer: {
    flex: 0.4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 24,
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  card: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.2,
    backgroundColor: '#ffcccb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightText: {
    transform: [{ rotate: '90deg' }],
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leftText: {
    transform: [{ rotate: '-90deg' }],
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: 'red',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: 'blue',
  },
  leftView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    backgroundColor: 'green',
  },
  rightView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    backgroundColor: 'orange',
  },
  timerText: {
    fontSize: 48, 
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default SwipeableStack;