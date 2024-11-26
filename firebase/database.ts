import { ref, get, set } from "firebase/database";
import { auth, database } from "../config";
import { fetchTransitions, handleGptResponse } from "../config/gpt";

export const saveFlagsToFirebase = async (
  uid: string,
  mainFlag: string,
  targetFlag: string
) => {
  const userFlagsRef = ref(database, `users/${uid}/flags`);
  try {
    await set(userFlagsRef, { mainFlag, targetFlag });
  } catch (error) {
    console.error("Error saving flags to Firebase: ", error);
  }
};

export const fetchFlagsFromFirebase = async (
  uid: string,
  setFlags: (mainFlag: string, targetFlag: string) => void
) => {
  const userFlagsRef = ref(database, `users/${uid}/flags`);
  try {
    const snapshot = await get(userFlagsRef);
    if (snapshot.exists()) {
      const { mainFlag, targetFlag } = snapshot.val();
      setFlags(mainFlag, targetFlag);
    }
  } catch (error) {
    console.error("Error fetching flags from Firebase: ", error);
  }
};

export const handleListingWords = async (
  uid: string,
  mainFlag: string,
  targetFlag: string,
  setWordsList: (words: [string, string][]) => void,
  setLoading: (loading: boolean) => void,
  setWordNum: (num: number) => void
) => {
  setLoading(true);

  const originalWordsRef = ref(
    database,
    `users/${uid}/${mainFlag}${targetFlag}originalWords`
  );
  const translatedWordsRef = ref(
    database,
    `users/${uid}/${mainFlag}${targetFlag}translatedWords`
  );

  try {
    const [originalSnapshot, translatedSnapshot] = await Promise.all([
      get(originalWordsRef),
      get(translatedWordsRef),
    ]);

    const originalWords = originalSnapshot.exists()
      ? originalSnapshot.val()
      : [];
    const translatedWords = translatedSnapshot.exists()
      ? translatedSnapshot.val()
      : [];

    const combinedWords = originalWords.map(
      (originalWord: any, index: number) => {
        const translatedWord = translatedWords[index] || "";
        return [originalWord, translatedWord];
      }
    );
    setWordNum(originalWords.length);
    setWordsList(
      combinedWords.sort((a: string[], b: string[]) =>
        a[0].toLowerCase().localeCompare(b[0].toLowerCase())
      )
    );
    setLoading(false);
  } catch (error) {
    console.error("Error fetching the word service. Please try again", error);
    setLoading(false);
  }
};

export const fetchUserInfo = async (
  uid: string,
  setUserInfo: (userInfo: any) => void,
  setShowText: (show: boolean) => void
) => {
  const userRef = ref(database, `users/${uid}`);
  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      setUserInfo(snapshot.val());
      setShowText(true);
    } else {
      console.log("User data not found");
    }
  } catch (error) {
    console.log("Error fetching user data: " + error.message);
  }
};

export const handleAddingWords = async (
  userId: string,
  mainFlag: string,
  targetFlag: string,
  words: string,
  setText: (message: string) => void,
  setWordsList: (list: string[]) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);

  const originalWordsRef = ref(
    database,
    `users/${userId}/${mainFlag}${targetFlag}originalWords`
  );
  const translatedWordsRef = ref(
    database,
    `users/${userId}/${mainFlag}${targetFlag}translatedWords`
  );

  try {
    // Mevcut kelimeleri getir
    const originalSnapshot = await get(originalWordsRef);
    const translatedSnapshot = await get(translatedWordsRef);

    let currentOriginalWords = originalSnapshot.exists()
      ? originalSnapshot.val()
      : [];
    let currentTranslatedWords = translatedSnapshot.exists()
      ? translatedSnapshot.val()
      : [];

    if (!Array.isArray(currentOriginalWords)) currentOriginalWords = [];
    if (!Array.isArray(currentTranslatedWords)) currentTranslatedWords = [];

    // Yeni kelimeleri filtrele
    const newWords = words.split(/\s+/).map((word) => word.toLowerCase());
    const uniqueNewWords = newWords.filter(
      (word) => !currentOriginalWords.includes(word)
    );

    if (uniqueNewWords.length === 0) {
      setText("No new unique words to add.");
      setLoading(false);
      return;
    }

    // Yeni kelimeler için çevirileri al
    const translations = await fetchTransitions(
      uniqueNewWords,
      mainFlag,
      targetFlag,
      setLoading
    );

    const formattedWordsList = handleGptResponse(translations, uniqueNewWords);

    // Mevcut listelere yeni kelimeleri ekle
    const updatedOriginalWords = [...currentOriginalWords, ...uniqueNewWords];
    const updatedTranslatedWords = [
      ...currentTranslatedWords,
      ...formattedWordsList.map((item) => item.split(" -> ")[1]),
    ];

    // Yeni listeleri kaydet
    await set(originalWordsRef, updatedOriginalWords);
    await set(translatedWordsRef, updatedTranslatedWords);

    // Güncellenmiş listeyi ve mesajı ayarla
    setWordsList(
      updatedOriginalWords
        .map((word, index) => `${word} -> ${updatedTranslatedWords[index]}`)
        .reverse()
    );
    setText(`Words successfully added: ${uniqueNewWords.join(", ")}`);
  } catch (error) {
    console.error("Error adding words:", error);
    setText("Error adding words to the database.");
  } finally {
    setLoading(false);
  }
};

export const useSaveWord = () => {
  const saveWordPair = async (
    selectedWord: string | null,
    translatedWord: string | null,
    mainFlag: string,
    targetFlag: string,
    setLoading: (loading: boolean) => void,
    setModalVisible: (visible: boolean) => void
  ) => {
    if (!selectedWord || !translatedWord) {
      console.log("No word selected or translation is missing.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }

    const userId = currentUser.uid;
    const originalWordsPath = `users/${userId}/${mainFlag}${targetFlag}originalWords`;
    const translatedWordsPath = `users/${userId}/${mainFlag}${targetFlag}translatedWords`;

    console.log("Attempting to save to Firebase.");
    console.log("Selected Word: ", selectedWord);
    console.log("Translated Word: ", translatedWord);
    console.log("Original Words Path: ", originalWordsPath);
    console.log("Translated Words Path: ", translatedWordsPath);

    setLoading(true);

    try {
      const originalWordsRef = ref(database, originalWordsPath);
      const translatedWordsRef = ref(database, translatedWordsPath);

      const originalSnapshot = await get(originalWordsRef);
      const translatedSnapshot = await get(translatedWordsRef);

      let currentOriginalWords = originalSnapshot.exists()
        ? originalSnapshot.val()
        : [];
      let currentTranslatedWords = translatedSnapshot.exists()
        ? translatedSnapshot.val()
        : [];

      if (!Array.isArray(currentOriginalWords)) currentOriginalWords = [];
      if (!Array.isArray(currentTranslatedWords)) currentTranslatedWords = [];

      if (currentOriginalWords.includes(selectedWord)) {
        console.log("The word already exists in the originalWords list.");
        setModalVisible(false);
        setLoading(false);
        return;
      }

      const updatedOriginalWords = [...currentOriginalWords, selectedWord];
      const updatedTranslatedWords = [
        ...currentTranslatedWords,
        translatedWord,
      ];

      console.log("Saving updated words to Firebase...");

      await set(originalWordsRef, updatedOriginalWords);
      await set(translatedWordsRef, updatedTranslatedWords);

      console.log("Words successfully saved to Firebase.");

      setLoading(false);
      setModalVisible(false);
      return;
    } catch (error) {
      console.error("Error saving words to Firebase:", error);
      setLoading(false);
    }
  };

  return { saveWordPair };
};

export const saveWordPairOcr = async (
  mainFlag: string,
  targetFlag: string,
  selectedWord: string | null,
  translatedWord: string | null,
  setModalVisible: Function
) => {
  if (!selectedWord || !translatedWord) {
    console.log("No word selected or translation is missing.");
    return;
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.log("No user is currently logged in.");
    return;
  }

  const userId = currentUser.uid;
  const originalWordsRef = ref(
    database,
    `users/${userId}/${mainFlag}${targetFlag}originalWords`
  );
  const translatedWordsRef = ref(
    database,
    `users/${userId}/${mainFlag}${targetFlag}translatedWords`
  );

  try {
    const originalSnapshot = await get(originalWordsRef);
    const translatedSnapshot = await get(translatedWordsRef);

    let currentOriginalWords = originalSnapshot.exists()
      ? originalSnapshot.val()
      : [];
    let currentTranslatedWords = translatedSnapshot.exists()
      ? translatedSnapshot.val()
      : [];

    if (currentOriginalWords.includes(selectedWord)) {
      console.log("The word already exists.");
      setModalVisible(false);
      return;
    }

    const updatedOriginalWords = [...currentOriginalWords, selectedWord];
    const updatedTranslatedWords = [...currentTranslatedWords, translatedWord];

    await set(originalWordsRef, updatedOriginalWords);
    await set(translatedWordsRef, updatedTranslatedWords);

    setModalVisible(false);
  } catch (error) {
    console.error("Error saving words:", error);
  }
};

export const deleteCorrectWordsFromFirebase = async (
  uid: string,
  word: string,
  correctWord: string,
  mainFlag: string,
  targetFlag: string,
  setLoading: (loading: boolean) => void,
  shouldSetLoading = true
) => {
  if (shouldSetLoading) setLoading(true);

  const originalWordsRef = ref(
    database,
    `users/${uid}/${mainFlag}${targetFlag}originalWords`
  );
  const translatedWordsRef = ref(
    database,
    `users/${uid}/${mainFlag}${targetFlag}translatedWords`
  );

  try {
    const originalSnapshot = await get(originalWordsRef);
    if (originalSnapshot.exists()) {
      const currentOriginalWords = originalSnapshot.val();
      const wordIndex = currentOriginalWords.findIndex(
        (w) => w.trim().toLowerCase() === word.trim().toLowerCase()
      );

      if (wordIndex !== -1) {
        currentOriginalWords.splice(wordIndex, 1);
        await set(originalWordsRef, currentOriginalWords);
        console.log(`Deleted "${word}" from originalWords`);
      } else {
        console.log(`Word "${word}" not found in originalWords`);
      }
    }

    const translatedSnapshot = await get(translatedWordsRef);
    if (translatedSnapshot.exists()) {
      const currentTranslatedWords = translatedSnapshot.val();
      const correctWordIndex = currentTranslatedWords.findIndex(
        (w) => w.trim().toLowerCase() === correctWord.trim().toLowerCase()
      );

      if (correctWordIndex !== -1) {
        currentTranslatedWords.splice(correctWordIndex, 1);
        await set(translatedWordsRef, currentTranslatedWords);
        console.log(`Deleted "${correctWord}" from translatedWords`);
      } else {
        console.log(
          `Correct word "${correctWord}" not found in translatedWords`
        );
      }
    }

    console.log("Specified words successfully deleted from Firebase.");
  } catch (error) {
    console.error("Error deleting specified words from Firebase:", error);
  } finally {
    if (shouldSetLoading) setLoading(false);
  }
};

export const deleteWordsFromFirebase = async (
  uid: string,
  originalWord: string,
  translatedWord: string,
  mainFlag: string,
  targetFlag: string
) => {
  const originalWordsRef = ref(
    database,
    `users/${uid}/${mainFlag}${targetFlag}originalWords`
  );
  const translatedWordsRef = ref(
    database,
    `users/${uid}/${mainFlag}${targetFlag}translatedWords`
  );

  try {
    const originalSnapshot = await get(originalWordsRef);
    if (originalSnapshot.exists()) {
      let currentOriginalWords = originalSnapshot.val();
      currentOriginalWords = currentOriginalWords.filter(
        (word: string) =>
          word.trim().toLowerCase() !== originalWord.trim().toLowerCase()
      );
      await set(originalWordsRef, currentOriginalWords);
      console.log(`Deleted "${originalWord}" from originalWords`);
    } else {
      console.log(`No original words found for UID: ${uid}`);
    }

    const translatedSnapshot = await get(translatedWordsRef);
    if (translatedSnapshot.exists()) {
      let currentTranslatedWords = translatedSnapshot.val();
      currentTranslatedWords = currentTranslatedWords.filter(
        (word: string) =>
          word.trim().toLowerCase() !== translatedWord.trim().toLowerCase()
      );
      await set(translatedWordsRef, currentTranslatedWords);
      console.log(`Deleted "${translatedWord}" from translatedWords`);
    } else {
      console.log(`No translated words found for UID: ${uid}`);
    }

    console.log("Specified words successfully deleted from Firebase.");
  } catch (error) {
    console.error("Error deleting specified words from Firebase:", error);
  }
};
