import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
import FlipLogo from "../components/FlipLogo";
import "../CSS/Home.css";
import { useUser } from "../contexts/UserContext";
import CardDesign from "../pages/CardDesign";

export default function MainScreen() {
  const navigate = useNavigate();
  const { user, loading, theme, toggleTheme, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(true);
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }

    const savedPage = localStorage.getItem("activePage");
    if (savedPage) {
      setActivePage(savedPage);
    }
  }, [loading, user, navigate]);

  const pages = [
    { label: "Kart Bilgilerim", key: "carddesign" },
    { label: "Kart Tasarımlarım", key: "preview" },
    { label: "Kişilerim", key: "contacts" },
    { label: "İsteklerim", key: "requests" },
    { label: "Kullanıcı Ara", key: "search" },
  ];

  const bottomPages = ["Tema:", "Hesap Ayarları"];

  const handleLogout = async () => {
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
    setMenuOpen((prev) => !prev);
  };

  const handlePageChange = (key) => {
    setActivePage(key);
    localStorage.setItem("activePage", key);
  };

  if (loading) return <div>Yükleniyor...</div>;

  const renderContent = () => {
    switch (activePage) {
      case "carddesign":
        return <CardDesign />;
      case "home":
        return <div>Burada Anasayfa içeriği olabilir.</div>;
      case "preview":
        return <div>Kart Önizle sayfası hazırlanıyor.</div>;
      case "contacts":
        return <div>Kişilerim sayfası hazırlanıyor.</div>;
      case "requests":
        return <div>İsteklerim sayfası hazırlanıyor.</div>;
      case "search":
        return <div>Kullanıcı Ara sayfası hazırlanıyor.</div>;
      default:
        return <div>Sayfa bulunamadı.</div>;
    }
  };

  const getPageTitle = (key) => {
    const page = pages.find((p) => p.key === key);
    return page ? page.label : "Ana Sayfa";
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

          {pages.map(({ label, key }) => (
            <button
              key={key}
              className={`sidebar-btn ${activePage === key ? "active" : ""}`}
              onClick={() => handlePageChange(key)}
            >
              {label}
            </button>
          ))}

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
              }
              return (
                <button
                  key={page}
                  className="sidebar-btn"
                  onClick={() => alert(`${page} sayfası henüz yapılmadı.`)}
                >
                  {page}
                </button>
              );
            })}

            <button className="sidebar-close-btn" onClick={toggleMenu}>
              Menüyü Kapat
            </button>
          </div>
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
