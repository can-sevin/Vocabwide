import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Card from '../Card/index';
import { Images, Sounds } from '../../config';
import { BackButtonContainer, BackButtonIcon, ModalText, CardContainer } from './styles';
import { playSound } from '../../config/sounds';

const SwipeableStack = ({ navigation }) => {
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

  useEffect(() => {
    if (cards.length > 0) {
      const interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime === 1) {
            removeCard();
            playSound('time');
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
      <GestureHandlerRootView>
        <BackButtonContainer onPress={() => navigation.goBack()}>
          <BackButtonIcon source={Images.back_icon} />
        </BackButtonContainer>
        <ModalText>Questionnaire: Please swipe the cards as required.</ModalText>

        <CardContainer>
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
        </CardContainer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default SwipeableStack;