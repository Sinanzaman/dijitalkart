import { useState, useEffect } from "react";
import MyDesigns from "../components/MyDesigns";
import "../CSS/SelectDesign.css";
import PreviewModal from "../components/PreviewModal";
import { useUser } from "../contexts/UserContext";

const SelectDesign = () => {
  const { cardid } = useUser();
  const [profileImage, setProfileImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(null);
  const [currentSelectedDesignId, setCurrentSelectedDesignId] = useState(null);

  const [messages, setMessages] = useState({});

  const API_URL = "http://localhost:8080/api/cards";

  const designProps = {
    profileImage,
    backgroundImage,
    fullName,
    jobTitle,
    about,
    email,
    phone,
    linkedin,
    github,
    website,
    skills,
    projects,
  };

  useEffect(() => {
    const fetchCard = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.profileImageUrl || "");
          setBackgroundImage(data.backgroundImageUrl || "");
          setFullName(data.fullName || "");
          setJobTitle(data.jobTitle || "");
          setAbout(data.about || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setLinkedin(data.linkedinUrl || "");
          setGithub(data.githubUrl || "");
          setWebsite(data.websiteUrl || "");
          setSkills(data.skills || []);
          setProjects(data.projects || []);
          setCurrentSelectedDesignId(data.selectedDesignId || null);
        } else {
          console.error("Kullanıcı kartı getirilemedi.");
        }
      } catch (error) {
        console.error("Kart getirme hatası:", error);
      }
    };

    fetchCard();
  }, []);

  const handleSaveSelectedDesign = async (newDesignId, index) => {
    setMessages((prev) => ({ ...prev, [index]: "" }));

    const token = localStorage.getItem("token");
    if (!token) {
      setMessages((prev) => ({
        ...prev,
        [index]: "Token bulunamadı, lütfen giriş yapın.",
      }));
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedDesignId: newDesignId }),
      });

      if (response.ok) {
        setMessages((prev) => ({
          ...prev,
          [index]: "Tasarım seçimi başarıyla güncellendi!",
        }));
        setCurrentSelectedDesignId(newDesignId);
        setSelectedDesignIndex(null);
      } else {
        const errorText = await response.text();
        setMessages((prev) => ({
          ...prev,
          [index]: "Güncelleme hatası: " + errorText,
        }));
      }
    } catch (error) {
      setMessages((prev) => ({
        ...prev,
        [index]: "İstek sırasında hata oluştu: " + error.message,
      }));
    }
  };

  const handleCardClick = (index) => {
    setSelectedDesignIndex(index);
    setMessages({});
  };

  const closeModal = () => {
    setSelectedDesignIndex(null);
    setMessages({});
  };

  return (
    <div className="selectdesign-container">
      {/* Mevcut seçili kart bilgisi */}
      <div className="current-selected-design">
        Mevcut Seçili Kart:{" "}
        {currentSelectedDesignId !== null
          ? currentSelectedDesignId
          : "Seçili kart yok"}
      </div>

      <div className="design-grid">
        {[1, 2, 3].map((index) => (
          <div key={index} className="design-item">
            <MyDesigns cardid={cardid} designindex={index} {...designProps} />

            <div className="buttons-row">
              <button
                className="preview-button"
                onClick={() => handleCardClick(index)}
              >
                Kartı Önizle
              </button>

              <button
                className="use-button"
                onClick={() => handleSaveSelectedDesign(index, index)}
              >
                Bu Kartı Kullan
              </button>
            </div>

            {messages[index] && (
              <p
                className={`message-text ${
                  messages[index].toLowerCase().includes("hata")
                    ? "error"
                    : "success"
                }`}
              >
                {messages[index]}
              </p>
            )}
          </div>
        ))}
      </div>
      <PreviewModal
        cardid={cardid}
        isOpen={selectedDesignIndex !== null}
        onRequestClose={closeModal}
        designindex={selectedDesignIndex}
        designProps={designProps}
      />
    </div>
  );
};

export default SelectDesign;
