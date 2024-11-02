import { SetStateAction } from "react";
import OpenAI from "react-native-openai";

const openAI = new OpenAI({
  apiKey:
    "sk-zg3ScPyz8Vt_85ySlHzxu9ZQwu6ZERL36DCwOapbk1T3BlbkFJLOAwi9W6N2APFW5bhqMnbKOP5spAFiTYPQHKIt1V4A",
  organization: "org-4w3wVZyvZiEkkfMi0AodB4cv",
});

export const fetchTranslations = async (
  gptWord: string[],
  translatedTexts: string[],
  target: string,
  setCards: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const wordPairs = gptWord.map(
    (word, index) => `"${word}": "${translatedTexts[index]}"`
  );

const prompt = `
Here is a list of English words with their exact translations in ${target} language: {${wordPairs.join(
  ", "
)}}.
Do not translate the words yourself. Use only the provided translations as the exact "correct" translations.

For each word, find 3 other similar words in ${target} language. Ensure these words:
1. Are in the same ${target} language as the "correct" translation.
2. Do not carry the exact meaning of the "correct" translation, but are somewhat related.
3. Do not give synonyms or directly interchangeable words that could fully replace the correct translation.

For example, if the correct translation for "orange" is "turuncu", do not use words like "portakal" (meaning the fruit) or exact synonyms of "turuncu". Instead, choose words that suggest a similar color tone or concept, but are not direct synonyms or definitions.

The response format should be:
{
  "word1": { "correct": "exact_translation_provided", "others": ["similar_word1_not_exact_synonym", "similar_word2_not_exact_synonym", "similar_word3_not_exact_synonym"] },
  "word2": { "correct": "exact_translation_provided", "others": ["similar_word1_not_exact_synonym", "similar_word2_not_exact_synonym", "similar_word3_not_exact_synonym"] }
}

Return only JSON in this format, with no explanations or additional text. Make sure the similar words are not exact synonyms or the same as the correct translation.`;

  setLoading(true);
  const updatedCards: SetStateAction<any[]> = [];

  try {
    const result = await openAI.chat.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4o-mini",
    });

    let rawResponse = result.choices[0].message.content.trim();
    rawResponse = rawResponse.replace(/```json|```/g, "").trim();

    const parsedResponse = JSON.parse(rawResponse);
    console.log("Parsed GPT Response:", parsedResponse);

    Object.keys(parsedResponse).forEach((word) => {
      const { correct, others } = parsedResponse[word];
      const uniqueOthers = Array.from(new Set(others));
      const allOptions = [...uniqueOthers.slice(0, 3), correct];
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
  } catch (error) {
    console.error("Error parsing GPT response:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};
