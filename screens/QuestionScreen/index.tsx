import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, View, Text, Animated } from "react-native";
import {
  Container,
  CardContainer,
  QuestionContainer,
  ModalText,
  FinishText,
  TopView,
  BottomView,
  LeftView,
  RightView,
  TextStyled,
} from "./style";
import { Card } from "../../components/Card";
import { BackButton } from "../../components/BackButton";
import { Images, Sounds } from "../../config";
import { Audio } from "expo-av";
import { fetchTranslations } from "../../config/gpt";
import LottieView from "lottie-react-native";
import { deleteCorrectWordsFromFirebase } from "../../firebase/database";

export const QuestionScreen = ({ navigation, route }) => {
  const { target, main, wordsList, uid } = route.params;
  const originalTexts = useRef(wordsList.map(([word]) => word));

  const [cards, setCards] = useState(
    wordsList.map(([word]) => ({
      originalText: word,
      text: word,
      removing: false,
      top: "TopWord",
      bottom: "BottomWord",
      left: "LeftWord",
      right: "RightWord",
    }))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(5);
  const [loading, setLoading] = useState(true);
  const [showFinish, setShowFinish] = useState(false);
  const [timerColor, setTimerColor] = useState("black");
  const [correctCount, setCorrectCount] = useState(0);

  const timerScale = useRef(new Animated.Value(1)).current;

  const playSound = async (soundKey: string) => {
    const soundSource = Sounds[soundKey];
    if (!soundSource) {
      console.warn(`Ses kaynağı bulunamadı: ${soundKey}`);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(soundSource);
    await sound.playAsync();
  };

  useEffect(() => {
    const getTranslations = async () => {
      try {
        setLoading(true);
        await fetchTranslations(
          wordsList.map(([word]) => word),
          wordsList.map(([_, translation]) => translation),
          target,
          setCards,
          setLoading
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching translations: ", error);
        setLoading(false);
      }
    };

    getTranslations();
  }, []);

  useEffect(() => {
    if (!loading && cards.length > 0) {
      const interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime === 1) {
            handleNextCard();
            return 5;
          } else {
            animateTimer();
            return prevTime - 1;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cards, loading, currentIndex]);

  const handleDeleteWords = async (word: string, correctWord: string) => {
    await deleteCorrectWordsFromFirebase(
      uid,
      word,
      correctWord,
      main,
      target,
      setLoading,
      false
    );
  };

  const animateTimer = () => {
    timerScale.setValue(1);
    Animated.spring(timerScale, {
      toValue: 1.2,
      friction: 2,
      useNativeDriver: true,
    }).start();
  };

  const handleNextCard = () => {
    setTimerColor("black");
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setTimer(5);
    } else {
      setShowFinish(true);
    }
  };

  const checkAnswer = (direction: string | number, original: string) => {
    const card = cards[currentIndex];
    const selectedWord = String(card[direction]).trim().toLowerCase();
    const correctWord = String(card.correct).trim().toLowerCase();

    console.log("selectedWord", selectedWord);
    console.log("correctWord", correctWord);

    if (selectedWord === correctWord && correctWord) {
      playSound("correct");
      setTimerColor("green");
      handleDeleteWords(original, correctWord);
      setCorrectCount((prev) => prev + 1);
      setTimeout(() => {
        setTimerColor("black");
        handleNextCard();
      }, 1000);
      return true;
    } else {
      playSound("error");
      setTimerColor("red");
      setTimeout(() => {
        setTimerColor("black");
        handleNextCard();
      }, 1000);
      return false;
    }
  };

  const updateCardText = (index: any, direction: any) => {
    setCards((prevCards: any[]) =>
      prevCards.map((card: any, i: any) =>
        i === index ? { ...card, text: direction } : card
      )
    );
  };

  const resetCardText = (index: any) => {
    const originalText = originalTexts.current[index];
    setCards((prevCards: any[]) =>
      prevCards.map((card: any, i: any) =>
        i === index ? { ...card, text: originalText } : card
      )
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <BackButton navigation={navigation} />
        {loading ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginHorizontal: 64,
            }}
          >
            <LottieView
              style={{ width: 150, height: 150 }}
              source={Images.lottie_recognition}
              loop={true}
              autoPlay
            />
            <ModalText>
              Test preparing, please wait approximately 10 sec...
            </ModalText>
          </View>
        ) : showFinish ? (
          <FinishText>
            {`Correct: ${correctCount}/${originalTexts.current.length} words`}
          </FinishText>
        ) : (
          <>
            <QuestionContainer>
              <ModalText>
                Match the words with their correct meanings 🧩
              </ModalText>
              <ModalText>
                {currentIndex + 1} / {originalTexts.current.length} questions
                completed
              </ModalText>
            </QuestionContainer>
            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <Animated.Text
                style={{
                  fontSize: 24,
                  color: timerColor,
                  transform: [{ scale: timerScale }],
                }}
              >
                {timer}
              </Animated.Text>
            </View>
            <CardContainer source={Images.background}>
              {cards.length > 0 && (
                <Card
                  key={currentIndex}
                  card={cards[currentIndex].text}
                  index={currentIndex}
                  removing={cards[currentIndex].removing}
                  originalText={originalTexts.current[currentIndex]}
                  updateCardText={updateCardText}
                  resetCardText={resetCardText}
                  playSound={playSound}
                  top={cards[currentIndex].top}
                  right={cards[currentIndex].right}
                  left={cards[currentIndex].left}
                  bottom={cards[currentIndex].bottom}
                  isCorrect={(direction: any) =>
                    checkAnswer(direction, originalTexts.current[currentIndex])
                  }
                />
              )}
              <TopView>
                <TextStyled>{cards[currentIndex].top}</TextStyled>
              </TopView>
              <BottomView>
                <TextStyled>{cards[currentIndex].bottom}</TextStyled>
              </BottomView>
              <LeftView>
                <TextStyled>{cards[currentIndex].left}</TextStyled>
              </LeftView>
              <RightView>
                <TextStyled>{cards[currentIndex].right}</TextStyled>
              </RightView>
            </CardContainer>
          </>
        )}
      </Container>
    </SafeAreaView>
  );
};

export default QuestionScreen;
