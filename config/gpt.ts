import OpenAI from 'react-native-openai';

const openAI = new OpenAI({
  apiKey: 'sk-zg3ScPyz8Vt_85ySlHzxu9ZQwu6ZERL36DCwOapbk1T3BlbkFJLOAwi9W6N2APFW5bhqMnbKOP5spAFiTYPQHKIt1V4A',
  organization: 'org-4w3wVZyvZiEkkfMi0AodB4cv',
});

export const fetchTranslations = async (
  gptWord: string[],
  target: string,
  setCards: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const prompt = `Here is a list of words: ${gptWord.join(', ')}.
  For each word, find 3 similar words in ${target} and return them as a JSON object.
  The format should be: 
  {
    "word1": { "correct": "correct_translation", "others": ["similar_word1", "similar_word2", "similar_word3"] },
    "word2": { "correct": "correct_translation", "others": ["similar_word1", "similar_word2", "similar_word3"] }
  }
  Return only JSON.`;

    setLoading(true);
    const updatedCards = [];

    const result = await openAI.chat.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-4o-mini',
    });

    let rawResponse = result.choices[0].message.content.trim();
    rawResponse = rawResponse.replace(/```json|```/g, '').trim();

    try {
      const parsedResponse = JSON.parse(rawResponse);
      console.log('Parsed GPT Response:', parsedResponse);
    
      Object.keys(parsedResponse).forEach((word) => {
        const { correct, others } = parsedResponse[word];
        const allOptions = [...others, correct];
      
        const shuffled = allOptions.sort(() => 0.5 - Math.random());

        const wordData = {
          text: word,
          top: shuffled[0],
          bottom: shuffled[1],
          left: shuffled[2],
          right: shuffled[3],
          correct,
          removing: false,
        };
      
        updatedCards.push(wordData);
      });
    
      setCards(updatedCards);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing GPT response:', error);
      setLoading(false);
      throw error;
    }    
};