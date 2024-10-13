import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, SafeAreaView } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { BackButtonContainer, BackButtonIcon, ModalText } from './style';
import { Colors, Images, Sounds } from '../../config';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.15;
const SWIPE_THRESHOLD_HEIGHT = SCREEN_HEIGHT * 0.1;

const Card = ({ card, index, removing, originalText, updateCardText, resetCardText, removeCard, playSound }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (removing) {
      opacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(removeCard)(index);
      });
    }
  }, [removing]);

  const triggerFadeOut = (index) => {
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
        <ImageBackground
          source={Images.yellow_card}
          imageStyle={styles.imageStyle}
          style={styles.imageBackground}>
        <Text style={styles.cardText}>{card}</Text>
        </ImageBackground>
      </Animated.View>
    </PanGestureHandler>
  );
};

export const SwipeableStack = ({ navigation }) => {
  const [cards, setCards] = useState([
    { text: 'Card 1', removing: false },
    { text: 'Card 2', removing: false },
    { text: 'Card 3', removing: false },
    { text: 'Card 4', removing: false },
    { text: 'Card 5', removing: false },
    { text: 'Card 6', removing: false },
    { text: 'Card 7', removing: false },
  ]);

  const [timer, setTimer] = useState(10);

  const playSound = async (soundKey: keyof typeof Sounds) => {
    const { sound } = await Audio.Sound.createAsync(Sounds[soundKey]);
    await sound.playAsync();
  };

  useEffect(() => {
    if (cards.length > 0) {
      const interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime === 1) {
            removeCard();
            runOnJS(playSound)("time");
            return 10;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cards]);

  const removeCard = () => {
    const lastIndex = cards.length - 1;
    if (lastIndex >= 0) {
      setCards((prevCards) => {
        const filteredCards = prevCards.filter((_, i) => i !== lastIndex);
        setTimer(10);
        return filteredCards;
      });
    }
  };

  const updateCardText = (index, direction) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      if (updatedCards[index]) {
        updatedCards[index] = { ...updatedCards[index], text: direction };
      }
      return updatedCards;
    });
  };

  const resetCardText = (index, originalText) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      if (updatedCards[index]) {
        updatedCards[index] = { ...updatedCards[index], text: originalText };
      }
      return updatedCards;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.container}>
        <BackButtonContainer onPress={() => navigation.goBack()}>
          <BackButtonIcon source={Images.back_icon} />
        </BackButtonContainer>
        <View style={styles.questionContainer}>
          <ModalText>Questionnaire: Please swipe the cards as required.</ModalText>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timer}</Text>
        </View>

        <ImageBackground
          source={Images.background}
          style={styles.cardContainer}
          resizeMode="cover"
          blurRadius={20}
        >
          {cards.map((card, index) => (
            <Card
              key={index}
              card={card.text}
              index={index}
              removing={card.removing}
              originalText={`Card ${index + 1}`}
              updateCardText={updateCardText}
              resetCardText={resetCardText}
              removeCard={removeCard}
              playSound={playSound}
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
        </ImageBackground>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionContainer: {
    flex: 0.36,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 24,
    borderRadius: 16,
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  cardContainer: {
    flex: 0.64,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    backgroundColor: Colors.LighterGray1,
  },
  card: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
  },
  imageStyle: {
    borderRadius: 12,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  leftView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
  },
  rightView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
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
