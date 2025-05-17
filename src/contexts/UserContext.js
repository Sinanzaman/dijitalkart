// src/UserContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getUserData, setUserTheme } from "../firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);

      if (currentUser) {
        const data = await getUserData();
        setUserData(data);
        setTheme(data?.theme || "light");
        setUsername(data?.username || "Kullanıcı Adı");
      } else {
        setUserData(null);
        setTheme("light");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setUserTheme(newTheme);
    // İstersen userData veya firestore'a da tema bilgisini kaydet
  };

  return (
    <UserContext.Provider value={{ firebaseUser, userData, loading, theme, toggleTheme, username }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
