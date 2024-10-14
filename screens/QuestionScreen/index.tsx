import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { Container, CardContainer, QuestionContainer, ModalText, TopView, BottomView, LeftView, RightView, TextStyled, FinishText } from './style';
import { Card } from '../../components/Card';
import { Timer } from '../../components/Timer';
import { BackButton } from '../../components/BackButton';
import { Images, Sounds } from '../../config';
import { Audio } from 'expo-av';

export const QuestionScreen = ({ navigation }) => {
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

  const playSound = async (soundKey: string) => {
    const { sound } = await Audio.Sound.createAsync(Sounds[soundKey]);
    await sound.playAsync();
  };

  useEffect(() => {
    if (cards.length > 0) {
      const interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime === 1) {
            removeCard(cards.length - 1);
            playSound("time");
            return 10;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cards]);

  const removeCard = (index: number) => {
    setCards((prevCards) => prevCards.filter((_, i) => i !== index));
    setTimer(10);
  };

  const updateCardText = (index: number, direction: string) => {
    setCards((prevCards) => prevCards.map((card, i) => (i === index ? { ...card, text: direction } : card)));
  };

  const resetCardText = (index: number, originalText: string) => {
    setCards((prevCards) => prevCards.map((card, i) => (i === index ? { ...card, text: originalText } : card)));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <BackButton navigation={navigation} />
        {cards.length > 0 ? (
          <>
        <QuestionContainer>
          <ModalText>Questionnaire: Please swipe the cards as required.</ModalText>
        </QuestionContainer>

        <Timer timer={timer} />

        <CardContainer source={Images.background}>
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

          <TopView><TextStyled>Top</TextStyled></TopView>
          <BottomView><TextStyled>Bottom</TextStyled></BottomView>
          <LeftView><TextStyled>Left</TextStyled></LeftView>
          <RightView><TextStyled>Right</TextStyled></RightView>
        </CardContainer>
        </>
        ) : (
          <FinishText>Finish</FinishText>
        )}
      </Container>
    </SafeAreaView>
  );
};

export default QuestionScreen;