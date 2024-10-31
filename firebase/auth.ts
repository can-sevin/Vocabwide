// firebaseHelpers.ts
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, database } from "../config";
import { ref, set } from "firebase/database";

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