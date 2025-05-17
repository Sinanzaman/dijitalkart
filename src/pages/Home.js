import React, { useState, useEffect } from "react";
import { signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
import FlipLogo from "../components/FlipLogo";
import "../CSS/Home.css";
import { useUser } from "../contexts/UserContext";

const auth = getAuth();

export default function MainScreen() {
  const navigate = useNavigate();
  const { firebaseUser, userData, loading, theme, toggleTheme } = useUser();

  // Menü açık-kapalı durumu local state'te tutuluyor
  const [menuOpen, setMenuOpen] = useState(true);

  // Eğer kullanıcı yoksa login sayfasına yönlendir
  useEffect(() => {
    if (!loading && !firebaseUser) {
      navigate("/login");
    }
  }, [loading, firebaseUser, navigate]);

  // Sayfa isimleri
  const pages = [
    "Kart Tasarımım",
    "Kart Önizle",
    "Kişilerim",
    "İsteklerim",
    "Kullanıcı Ara",
  ];
  const bottomPages = ["Tema:", "Hesap Ayarları"];

  const handleLogout = async () => {
  const confirmed = window.confirm("Çıkış yapmak istediğinize emin misiniz?");
  if (!confirmed) return; // Kullanıcı iptal ederse çıkış yapma

  try {
    await signOut(auth);
    alert("Başarıyla çıkış yaptınız!");
    navigate("/login");
  } catch (error) {
    console.error("Çıkış hatası:", error);
    alert("Çıkış yapılırken bir hata oluştu: " + error.message);
  }
};

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className={`main-container ${theme}`}>
      {/* Sol Üst - Logo */}
      <div className="logo-container">
        <FlipLogo theme={theme} />
      </div>

      {/* Sağ Üst - Sayfa başlığı ve kullanıcı bilgisi */}
      <div className="header">
        <div className="page-title">Anasayfa</div>
        <div className="user-info">
          <div className="user-text">
            <div className="user-name">
              {userData?.username || "Kullanıcı Adı"}
            </div>
            <div className="user-email">{firebaseUser?.email || ""}</div>
          </div>
          <button
            className="logout-btn"
            title="Çıkış Yap"
            onClick={handleLogout}
          >
            <IoMdExit />
          </button>
        </div>
      </div>

      {/* Sol Alt Menü */}
      {menuOpen && (
        <div className="sidebar">
          <div className="sidebar-separator"></div>

          {/* Ana sayfa butonları */}
          {pages.map((page) => (
            <button
              key={page}
              className="sidebar-btn"
              onClick={() => alert(`${page} sayfası henüz yapılmadı.`)}
            >
              {page}
            </button>
          ))}

          {/* Alt sayfalar ve tema butonu */}
          <div className="sidebar-bottom">
            {bottomPages.map((page) => {
              if (page === "Tema:") {
                return (
                  <button
                    key={page}
                    className="sidebar-btn"
                    onClick={toggleTheme}
                  >
                    Tema: {theme === "light" ? "Aydınlık" : "Karanlık"}
                  </button>
                );
              } else {
                return (
                  <button
                    key={page}
                    className="sidebar-btn"
                    onClick={() => alert(`${page} sayfası henüz yapılmadı.`)}
                  >
                    {page}
                  </button>
                );
              }
            })}

            {/* Menü kapatma butonu */}
            <button className="sidebar-close-btn" onClick={toggleMenu}>
              Menüyü Kapat
            </button>
          </div>
        </div>
      )}

      {/* Menü kapalıysa açma butonu */}
      {!menuOpen && (
        <button
          className="sidebar-open-btn"
          title="Menüyü Aç"
          onClick={toggleMenu}
        >
          ☰
        </button>
      )}

      {/* Sağ Alt İçerik alanı */}
      <div
        className={`content ${
          menuOpen ? "content-with-sidebar" : "content-full"
        }`}
      >
        {/* İleride içerik buraya gelecek */}
      </div>
    </div>
  );
}
