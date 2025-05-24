import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [cardid, setCardid] = useState(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const logout = async () => {
    // Kullanıcı çıkış işlemi: token'ı sil, kullanıcıyı null yap
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    // Eğer geçerli bir token varsa, sunucudan kullanıcı bilgilerini çeker.
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("http://localhost:8080/api/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Yetkisiz veya token geçersiz");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setTheme(data.theme || "light");
        setCardid(data.cardid || null);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Kullanıcının kart ID'si varsa mesajları kontrol et
    if (user?.cardid) {
      checkUnreadMessages();
    }
  }, [user]);

  const checkUnreadMessages = async () => {
    // Kullanıcının okunmamış mesajlarını kontrol eder
    const token = localStorage.getItem("token");
    if (!token || !user?.cardid) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/messages/received/${user.cardid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Mesajlar alınamadı");
      const data = await res.json();
      const unreadMessages = data.filter(
        (msg) => msg.read === false || msg.isRead === false
      );
      setHasUnreadMessages(unreadMessages.length > 0);
      setUnreadMessageCount(unreadMessages.length);
    } catch (error) {
      console.error("Okunmamış mesaj kontrolü başarısız:", error);
      setHasUnreadMessages(false);
      setUnreadMessageCount(0);
    }
  };

  const toggleTheme = async () => {
    // Temayı light <-> dark arasında değiştirir
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (user) {
      const token = localStorage.getItem("token");
      try {
        await fetch("http://localhost:8080/api/auth/user/theme", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ theme: newTheme }),
        });
      } catch (error) {
        console.error("Tema güncelleme hatası:", error);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        theme,
        setTheme,
        toggleTheme,
        logout,
        cardid,
        hasUnreadMessages,
        setHasUnreadMessages,
        unreadMessageCount,
        setUnreadMessageCount
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
