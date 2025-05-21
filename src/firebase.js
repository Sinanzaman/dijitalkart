import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkQWBDjrIP6fKi6iGt29GOw93KQJjTcGM",
  authDomain: "whisperwrit.firebaseapp.com",
  databaseURL: "https://whisperwrit-default-rtdb.firebaseio.com",
  projectId: "whisperwrit",
  storageBucket: "whisperwrit.appspot.com",
  messagingSenderId: "22644839711",
  appId: "1:22644839711:web:a4ac74936a6ed376390c2a",
  measurementId: "G-MYJV2F5N7V"
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