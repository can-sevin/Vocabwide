// firebaseHelpers.ts
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, database } from "../config";
import { get, ref, set } from "firebase/database";

export const loginUser = async (
  email: string,
  password: string,
  setErrorState: (error: string) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
  } catch (error) {
    setErrorState("Invalid email or password. Please try again.");
    setLoading(false);
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  setLoading: (loading: boolean) => void,
  setErrorState: (error: string) => void
) => {
  setLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await set(ref(database, `users/${user.uid}`), {
      username: username,
      email: user.email,
      uid: user.uid,
      words: null,
    });

    setLoading(false);
  } catch (error) {
    setErrorState(error.message);
    setLoading(false);
  }
};

export const resetPassword = async (
  email: string,
  setLoading: (loading: boolean) => void,
  setErrorState: (error: string) => void,
  setSuccessMessage: (message: string) => void
) => {
  setLoading(true);
  try {
    await sendPasswordResetEmail(auth, email);
    setLoading(false);
    setSuccessMessage("Password reset email sent. Please check your inbox.");
  } catch (error) {
    setErrorState("Failed to send password reset email. Please try again.");
    setLoading(false);
  }
};

export const signInAnonymouslyWithFirebase = async (
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;

    console.log("Anonymous user signed in:", user);

    // Kullanıcıyı veritabanında kontrol et ve yoksa oluştur
    await createUserIfNotExists(user.uid);

    setLoading(false);
    return user;
  } catch (error) {
    console.error("Error during anonymous login:", error.message);
    setLoading(false);
    throw error;
  }
};

export const createUserIfNotExists = async (uid: string) => {
  const userRef = ref(database, `users/${uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    console.log("User data not found, creating new record...");
    await set(userRef, {
      name: "Anonymous",
      email: null,
      flags: { mainFlag: "en", targetFlag: "es" },
    });
    console.log("User record created.");
  } else {
    console.log("User data already exists.");
  }
};