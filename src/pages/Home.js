import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
import FlipLogo from "../components/FlipLogo";
import "../CSS/Home.css";
import { useUser } from "../contexts/UserContext";
import Designscreen from "./Designscreen";
import SelectDesign from "./SelectDesign";
import SearchUser from "./SearchUser";
import HomeScreen from "./Homescreen";
import MyContacts from "./MyContacts";
import UserSettings from "./UserSettings";
import ReceivedMessages from "./ReceivedMessage";
import DeliveredMessages from "./DeliveredMessages";

export default function MainScreen() {
  const navigate = useNavigate();
  const { user, loading, theme, toggleTheme, logout, unreadMessageCount } =
    useUser();
  const [menuOpen, setMenuOpen] = useState(true);
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    // Oturum açmamışsa login sayfasına yönlendir.
    if (!loading && !user) {
      navigate("/login");
    }
    const savedPage = localStorage.getItem("activePage");
    if (savedPage) {
      setActivePage(savedPage);
    }
  }, [loading, user, navigate]);

  const pages = [
    { label: "Kart Bilgilerim", key: "designscreen" },
    { label: "Kart Tasarımlarım", key: "preview" },
    { label: "Alınan Mesajlar", key: "received_message" },
    { label: "Gönderilen Mesajlar", key: "delivered_messages" },
    { label: "Kişilerim", key: "mycontacts" },
    { label: "Kullanıcı Ara", key: "search" },
    {
      label: `Tema: ${theme === "light" ? "Aydınlık" : "Karanlık"}`,
      key: "theme",
    },
    { label: "Hesap Ayarları", key: "usersettings" },
  ];

  const handleLogout = async () => {
    // Kullanıcının çıkış yapmasını sağlayan fonksiyon
    const confirmed = window.confirm("Çıkış yapmak istediğinize emin misiniz?");
    if (!confirmed) return;
    try {
      await logout();
      localStorage.removeItem("activePage");
      alert("Başarıyla çıkış yaptınız!");
      navigate("/login");
    } catch (error) {
      console.error("Çıkış hatası:", error);
      alert("Çıkış yapılırken bir hata oluştu: " + (error.message || error));
    }
  };

  const toggleMenu = () => {
    // Menü açılıp kapanmasını sağlayan toggle fonksiyonu
    setMenuOpen((prev) => !prev);
  };

  const handlePageChange = (key) => {
    // Menüden sayfa seçildiğinde aktif sayfayı güncelle ve localStorage'a kaydet
    setActivePage(key);
    localStorage.setItem("activePage", key);
  };

  // Eğer kullanıcı bilgisi yükleniyorsa yükleniyor mesajı göster
  if (loading) return <div>Yükleniyor...</div>;

  const renderContent = () => {
    switch (activePage) {
      case "designscreen":
        return <Designscreen />;
      case "home":
        return <HomeScreen />;
      case "preview":
        return <SelectDesign />;
      case "received_message":
        return <ReceivedMessages />;
      case "delivered_messages":
        return <DeliveredMessages />;
      case "mycontacts":
        return <MyContacts />;
      case "requests":
        return <div>İsteklerim sayfası hazırlanıyor.</div>;
      case "search":
        return <SearchUser />;
      case "usersettings":
        return <UserSettings />;
      default:
        return <HomeScreen />;
    }
  };

  const getPageTitle = (key) => {
    const page = pages.find((p) => p.key === key);
    if (page) return page.label;
    if (key === "usersettings") return "Hesap Ayarları";
    return "Ana Sayfa";
  };

  return (
    <div className={`main-container ${theme}`}>
      <div className="logo-container" onClick={() => handlePageChange("home")}>
        <FlipLogo theme={theme} />
      </div>

      <div className="header">
        <div className="page-title">{getPageTitle(activePage)}</div>
        <div className="user-info">
          <div className="user-text">
            <div className="user-name">{user?.username || "Kullanıcı Adı"}</div>
            <div className="user-email">{user?.email || ""}</div>
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
      
      {menuOpen && (
        <div className="sidebar">
          <div className="sidebar-separator"></div>

          {pages.map(({ label, key }) => {
            const isReceivedMessages = key === "received_message";

            return (
              <button
                key={key}
                className={`sidebar-btn ${activePage === key ? "active" : ""}`}
                onClick={() => {
                  if (key === "theme") {
                    toggleTheme();
                  } else if (key === "usersettings") {
                    handlePageChange("usersettings");
                  } else {
                    handlePageChange(key);
                  }
                }}
              >
                {label}
                {isReceivedMessages && unreadMessageCount > 0 && (
                  <span className="unread-badge">({unreadMessageCount})</span>
                )}
              </button>
            );
          })}

          <button className="sidebar-close-btn" onClick={toggleMenu}>
            Menüyü Kapat
          </button>
        </div>
      )}

      {!menuOpen && (
        <button
          className="sidebar-open-btn"
          title="Menüyü Aç"
          onClick={toggleMenu}
          style={{ opacity: 0.3 }}
        >
          ☰
        </button>
      )}

      <div
        className={`content ${
          menuOpen ? "content-with-sidebar" : "content-full"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}
