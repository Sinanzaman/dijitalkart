import { useState, useRef, useEffect } from "react";
import PreviewModal from "../components/PreviewModal";
import { useUser } from "../contexts/UserContext";
import "../CSS/SearchUser.css";

export default function SearchUser() {
  const [cardid, setCardid] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(1);
  const spanRef = useRef();

  const { user } = useUser();
  const currentUserId = user?.id;

  const authToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchCardData = async () => {
      if (!result?.id) return;

      try {
        const response = await fetch(
          `http://localhost:8080/api/cards/user/${result.id}`
        );

        const text = await response.text();
        if (text) {
          try {
            const data = JSON.parse(text);
            if (response.ok) {
              setCardData(data);
            } else {
              setCardData(null);
            }
          } catch {
            setCardData(null);
          }
        } else {
          setCardData(null);
        }
      } catch {
        setCardData(null);
      }
    };

    fetchCardData();
  }, [result?.id]);

  const handleSearch = async () => {
    if (!cardid.trim()) {
      alert("CardID boş olamaz.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/find-by-cardid/${cardid}`
      );
      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setStatus("success");
      } else {
        setResult(null);
        setStatus("notfound");
      }
    } catch {
      setResult(null);
      setStatus("error");
    }
  };

  const handleAddContact = async () => {
    if (!currentUserId || !result?.id) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/user/add-contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ contactUserId: result.id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Kişi başarıyla eklendi.");
      } else {
        alert(data.message || "Kişi eklenemedi.");
      }
    } catch {
      alert("Kişi eklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="search-container">
      <h2>Kullanıcı Ara</h2>
      <h4>CardID ile diğer kullanıcıları bulun.</h4>

      <div className="input-wrapper">
        <input
          type="text"
          placeholder="CardID girin..."
          value={cardid}
          onChange={(e) => setCardid(e.target.value)}
          className="input-field"
        />
        <span ref={spanRef} className="hidden-span">
          {cardid || "CardID girin..."}
        </span>
      </div>

      <button onClick={handleSearch} className="search-button">
        Ara
      </button>

      {status === "loading" && <p>Aranıyor...</p>}

      {status === "notfound" && (
        <p style={{ color: "red" }}>Kullanıcı bulunamadı.</p>
      )}

      {status === "success" && result && (
        <div className="result-section">
          <p>
            <strong>Kullanıcı Adı:</strong> {result.username}
          </p>
          <p>
            <strong>Email:</strong> {result.email}
          </p>

          <button
            onClick={() => {
              setPreviewIndex(cardData?.selectedDesignId || 1);
              setPreviewOpen(true);
            }}
          >
            Kartı Önizle
          </button>

          {currentUserId && result.id !== currentUserId && (
            <button onClick={handleAddContact} className="add-contact-button">
              Kullanıcıyı Ekle
            </button>
          )}

          {cardData && (
            <PreviewModal
              cardid={cardid}
              isOpen={previewOpen}
              onRequestClose={() => setPreviewOpen(false)}
              designindex={previewIndex}
              designProps={{
                profileImage: cardData.profileImageUrl,
                backgroundImage: cardData.backgroundImageUrl,
                fullName: cardData.fullName,
                jobTitle: cardData.jobTitle,
                about: cardData.about,
                email: cardData.email,
                phone: cardData.phone,
                linkedin: cardData.linkedinUrl,
                github: cardData.githubUrl,
                website: cardData.websiteUrl,
                skills: cardData.skills || [],
                projects: cardData.projects || [],
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
