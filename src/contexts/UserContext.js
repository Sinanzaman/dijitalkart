import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [cardid, setCardid] = useState(null);

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Uygulama açıldığında localStorage'den token kontrolü yapabiliriz:
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Token varsa backend'den user bilgilerini çekelim
    fetch("http://localhost:8080/api/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`, // Backend'in beklediği Authorization header
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
        localStorage.removeItem("token"); // Geçersiz token varsa temizle
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Tema değiştirme fonksiyonu - backend ile eşitleyebilirsin
  const toggleTheme = async () => {
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
      value={{ user, setUser, loading, theme, setTheme, toggleTheme, logout, cardid }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
