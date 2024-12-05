import { SetStateAction } from "react";
import OpenAI from "react-native-openai";

const openAI = new OpenAI({
  apiKey:
    "sk-zg3ScPyz8Vt_85ySlHzxu9ZQwu6ZERL36DCwOapbk1T3BlbkFJLOAwi9W6N2APFW5bhqMnbKOP5spAFiTYPQHKIt1V4A",
  organization: "org-4w3wVZyvZiEkkfMi0AodB4cv",
});

export const createQuestion = async (
  gptWord: string[],
  translatedTexts: string[],
  main: string,
  target: string,
  setCards: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const wordPairs = gptWord.map(
    (word, index) => `"${word}": "${translatedTexts[index]}"`
  );

  const prompt = `
Here is a list of ${main} words with their exact translations in ${target} language: {${wordPairs.join(
    ", "
  )}}.
Do not translate the words yourself. Use only the provided translations as the exact "correct" translations.

For each word:
1. If the word has multiple meanings (e.g., "orange" has "turuncu" and "portakal"), treat each meaning as distinct but only include one as the correct option. Ensure the other correct meanings do not appear among the incorrect options.
2. Generate 3 other similar words in ${target} language that are:
   - In the same ${target} language as the correct translation.
   - Related to the word's context but do not carry the exact meaning.
   - Not direct synonyms of the correct meaning(s) and do not overlap with the other correct meanings.

The response format should be:
{
  "word1": { "correct": "exact_translation_provided", "others": ["similar_word1_not_exact", "similar_word2_not_exact", "similar_word3_not_exact"] },
  "word2": { "correct": "exact_translation_provided", "others": ["similar_word1_not_exact", "similar_word2_not_exact", "similar_word3_not_exact"] }
}

### Example:

If the word is "orange" and translations are ["turuncu", "portakal"]:
- The correct option could be "turuncu".
- The other options might be ["sarı", "kavuniçi", "açık sarı"] but should NOT include "portakal".

If the word is "mind" and translations are ["zihin", "akıl", "düşünce"]:
- The correct option could be "zihin".
- The other options might be ["hafıza", "fikir", "kavrayış"] but should NOT include "akıl" or "düşünce".

Return only JSON in this format, with no explanations or additional text. Make sure to apply the rules strictly.`;

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

export const fetchTransitions = async (
  words: string[],
  main: string,
  target: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const prompt = `
Translate the following words from ${main} to ${target} language. Provide distinct and accurate translations only if the word has multiple distinct meanings. Do not include variations of the same meaning (e.g., "apple" should only return "elma" for Turkish, not "kuru elma"). 

If the word has multiple distinct meanings, list them (e.g., "orange" -> ["turuncu", "portakal"]). If the word has only one meaning, return only that meaning.
If the word maybe is slang like;
{
  "lol": "laugh out loud",
  "brb": "be right back",
  "omg": "oh my god",
  "rofl": "rolling on the floor laughing",
  "idk": "I don't know"
}

Please translate slang meaning to ${target} language.

Use the format:
[
  {"word": "word1", "translations": ["meaning1", "meaning2", "meaning3"]},
  ...
]

Words: ${words.join(", ")}
`;

  setLoading(true);
  try {
    const result = await openAI.chat.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    const rawResponse = result.choices[0].message.content.trim();
    const parsedResponse = JSON.parse(rawResponse);
    return parsedResponse.map((item: any) => ({
      word: item.word,
      translations: item.translations || ["N/A"],
    }));
  } catch (error) {
    console.error("Error fetching translations:", error);
    return words.map((word) => ({ word, translations: ["N/A"] }));
  } finally {
    setLoading(false);
  }
};

export const handleGptResponse = (
  translations: { word: string; translations: string[] }[],
  uniqueNewWords: string[]
) => {
  const formattedList = uniqueNewWords.map((word) => {
    const translation = translations.find((t) => t.word === word);
    if (translation) {
      return `${word} -> ${translation.translations.join(", ")}`;
    }
    return `${word} -> N/A`;
  });
  return formattedList;
};
