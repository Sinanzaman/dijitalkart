import { useState, useRef, useEffect } from "react";
import PreviewModal from "../components/PreviewModal";
import { useUser } from "../contexts/UserContext";

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
        console.log("Raw response text:", text);

        if (text) {
          try {
            const data = JSON.parse(text);
            if (response.ok) {
              setCardData(data);
            } else {
              console.error("Kart bilgisi alınamadı:", data);
              setCardData(null);
            }
          } catch (e) {
            console.error("JSON parse hatası:", e);
            setCardData(null);
          }
        } else {
          console.warn("Boş response body");
          setCardData(null);
        }
      } catch (error) {
        console.error("Kart verisi getirme hatası:", error);
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
    } catch (err) {
      console.error("Hata:", err);
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
    } catch (err) {
      console.error("Hata:", err);
      alert("Kişi eklenirken bir hata oluştu.");
    }
  };

  const inputWidth = spanRef.current
    ? `${spanRef.current.offsetWidth + 10}px`
    : "150px";

  return (
    <div className="search-container" style={{ padding: "20px" }}>
      <h2>Kullanıcı Ara</h2>
      <h4>CardID ile diğer kullanıcıları bulun.</h4>

      <div style={{ display: "inline-block", position: "relative" }}>
        <input
          type="text"
          placeholder="CardID girin..."
          value={cardid}
          onChange={(e) => setCardid(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            fontSize: "16px",
            width: inputWidth,
            minWidth: "150px",
            maxWidth: "100%",
            transition: "width 0.2s",
          }}
        />
        <span
          ref={spanRef}
          style={{
            position: "absolute",
            visibility: "hidden",
            whiteSpace: "pre",
            fontSize: "16px",
            padding: "8px",
            fontFamily: "inherit",
          }}
        >
          {cardid || "CardID girin..."}
        </span>
      </div>

      <button onClick={handleSearch}>Ara</button>

      {status === "loading" && <p>Aranıyor...</p>}

      {status === "notfound" && (
        <p style={{ color: "red" }}>Kullanıcı bulunamadı.</p>
      )}

      {status === "success" && result && (
        <div style={{ marginTop: "20px" }}>
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
            <button
              onClick={handleAddContact}
              style={{
                marginLeft: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "8px 12px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Kişiyi Ekle
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
