import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import PreviewModal from "../components/PreviewModal";
import "../CSS/MyContacts.css"; // CSS dosyasını dahil ediyoruz

export default function MyContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);
  const [cardData, setCardData] = useState(null);

  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [messageRecipient, setMessageRecipient] = useState(null);

  const { user } = useUser();
  const authToken = localStorage.getItem("token");
  const myCardId = user?.cardid || "";

  useEffect(() => {
    if (!user?.id) return;

    const fetchContacts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:8080/api/auth/user/contacts`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Kişiler getirilemedi");
        }

        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err.message || "Bilinmeyen hata");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user?.id, authToken]);

  const fetchCardData = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/cards/user/${userId}`
      );

      const text = await response.text();

      if (text) {
        try {
          const data = JSON.parse(text);
          if (response.ok) {
            setCardData(data);
            setPreviewOpen(true);
          } else {
            console.error("Kart bilgisi alınamadı:", data);
            setCardData(null);
            alert("Kart bilgisi alınamadı.");
          }
        } catch (e) {
          console.error("JSON parse hatası:", e);
          setCardData(null);
          alert("Kart verisi okunamadı.");
        }
      } else {
        console.warn("Boş response body");
        setCardData(null);
        alert("Kart verisi boş.");
      }
    } catch (error) {
      console.error("Kart verisi getirme hatası:", error);
      setCardData(null);
      alert("Kart verisi getirilirken hata oluştu.");
    }
  };

  const handleRemoveContact = async (contactId) => {
    if (!window.confirm("Bu kullanıcıyı listenizden silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/user/remove-contact",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ contactUserId: contactId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Kişi silinemedi");
      }

      setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageRecipient) return alert("Lütfen bir alıcı seçin.");

    try {
      const response = await fetch("http://localhost:8080/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          senderCardId: myCardId,
          recipientCardId: messageRecipient.cardid,
          title: messageTitle,
          body: messageBody,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Mesaj gönderilemedi");
      }

      alert("Mesaj gönderildi!");
      setMessageModalOpen(false);
      setMessageTitle("");
      setMessageBody("");
      setMessageRecipient(null);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="my-contacts-container">
      <h2>Eklenen Kişiler</h2>

      {contacts.length === 0 && <p>Henüz kişi eklenmemiş.</p>}

      <ul className="my-contacts-userlist">
        {contacts.map((contact) => (
          <li key={contact.id}>
            <strong>{contact.username}</strong> — {contact.email}

            <div style={{margin: "auto"}}></div>

            <button
              className="my-contacts-button my-contacts-preview"
              onClick={() => {
                setPreviewUser(contact);
                fetchCardData(contact.id);
              }}
            >
              Kartı Önizle
            </button>

            <button
              className="my-contacts-button my-contacts-remove"
              onClick={() => handleRemoveContact(contact.id)}
            >
              Kullanıcıyı sil
            </button>

            <button
              className="my-contacts-button my-contacts-message"
              onClick={() => {
                setMessageRecipient(contact);
                setMessageModalOpen(true);
              }}
            >
              Kullanıcıya Ulaş
            </button>
          </li>
        ))}
      </ul>

      {cardData && previewOpen && previewUser && (
        <PreviewModal
          cardid={previewUser.cardid || ""}
          isOpen={previewOpen}
          onRequestClose={() => {
            setPreviewOpen(false);
            setCardData(null);
            setPreviewUser(null);
          }}
          designindex={cardData.selectedDesignId || 1}
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

      {messageModalOpen && messageRecipient && (
        <div className="message-modal-overlay">
          <form onSubmit={handleSendMessage} className="message-modal-content">
            <h3>{messageRecipient.username} kullanıcısına mesaj gönder</h3>

            <label>
              Gönderen CardId:
              <input type="text" value={myCardId} readOnly />
            </label>

            <label>
              Mesaj Başlığı:
              <input
                type="text"
                required
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
              />
            </label>

            <label>
              Mesaj İçeriği:
              <textarea
                required
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                rows={5}
              />
            </label>

            <div className="message-modal-actions">
              <button
                type="button"
                onClick={() => {
                  setMessageModalOpen(false);
                  setMessageTitle("");
                  setMessageBody("");
                  setMessageRecipient(null);
                }}
              >
                İptal
              </button>
              <button type="submit">Gönder</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
