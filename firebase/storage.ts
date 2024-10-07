import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from '../config/firebase';

// Upload file to Firebase Storage
export const uploadFile = async (file: File, filePath: string) => {
  const storageRef = ref(storage, filePath);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};