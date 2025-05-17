import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBRCLuYh_N4OPALuj0DZ_v13Cu4rYJDzA",
  authDomain: "dijitalkart-24c54.firebaseapp.com",
  projectId: "dijitalkart-24c54",
  storageBucket: "dijitalkart-24c54.firebasestorage.app",
  messagingSenderId: "860967294100",
  appId: "1:860967294100:web:6036e36827ecb40f0ad081",
  measurementId: "G-F93KZXQ8D8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth(app);

export const setUserTheme = async (theme) => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, { theme }, { merge: true });
};

export const saveUserToFirestore = async (uid, email, username) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    email,
    username,
    theme: "dark", // varsayılan tema
    createdAt: new Date().toISOString(),
  });
};

export const getTheme = async () => {
  const user = auth.currentUser;
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const userTheme = userData.theme || "light";
      return userTheme;
    } else {
      alert("Kullanıcı verisi Firestore'da bulunamadı.");
    }
  } catch (err) {
    console.error("Tema verisi alınırken hata:", err);
  }
};

export const getUserData = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("Kullanıcı oturumu açık değil.");
    return null;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data(); // Tüm kullanıcı verileri
    } else {
      console.warn("Kullanıcı Firestore'da bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Kullanıcı verileri alınırken hata oluştu:", error);
    return null;
  }
};