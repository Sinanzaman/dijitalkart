import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth(app);
export const storage = getStorage(app);

export const uploadImageAndReplaceOld = async (userId, file, type) => {
  const filePath = `users/${userId}/${type}.jpg`; // type = profilePhoto ya da backgroundPhoto
  const fileRef = ref(storage, filePath);

  // Önce varsa eski dosyayı sil
  try {
    await deleteObject(fileRef);
    console.log("Eski dosya silindi:", filePath);
  } catch (err) {
    if (err.code !== "storage/object-not-found") {
      throw err; // bilinmeyen hataysa patlat
    }
  }

  // Yeni dosyayı yükle
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
};