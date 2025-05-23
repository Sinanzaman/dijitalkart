import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function ReceivedMessages() {
  const {
    user,
    unreadMessageCount,
    setUnreadMessageCount,
    setHasUnreadMessages,
  } = useUser();
  const authToken = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:8080/api/messages/received/${user.cardid}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Mesajlar alınamadı");
        }

        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err.message || "Bilinmeyen hata");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user?.id, authToken]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Mesajı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Mesaj silinemedi");
      }

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id)
      );
    } catch (err) {
      alert(err.message || "Bilinmeyen bir hata oluştu");
    }
  };

  // Okundu olarak işaretleme fonksiyonu
  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/messages/${id}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ read: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Mesaj okundu olarak işaretlenemedi");
      }
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === id ? { ...msg, read: true } : msg
        )
      );
      if (unreadMessageCount == 1) {
        setHasUnreadMessages(false);
        setUnreadMessageCount(unreadMessageCount - 1);
      } else {
        setUnreadMessageCount(unreadMessageCount - 1);
      }
    } catch (err) {
      alert(err.message || "Bilinmeyen bir hata oluştu");
    }
  };

  if (loading) return <p>Mesajlar yükleniyor...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (messages.length === 0) return <p>Henüz mesaj almadınız.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.map((msg, index) => (
          <li
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: msg.read ? "#f9f9f9" : "#e0f7fa",
            }}
          >
            <h3>{msg.title}</h3>
            <p>{msg.body}</p>
            <p>
              <strong>Gönderen:</strong> {msg.senderCardId || "Bilinmiyor"}
            </p>
            <p style={{ fontSize: "0.9em", color: "#666" }}>
              Gönderim Tarihi:{" "}
              {new Date(msg.timestamp).toLocaleString("tr-TR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>

            <p
              style={{
                fontStyle: "italic",
                color: msg.read ? "green" : "orange",
              }}
            >
              Durum: {msg.read ? "Okundu" : "Okunmadı"}
            </p>

            {/* Okundu durumu */}
            {!msg.read && (
              <button onClick={() => handleMarkAsRead(msg.id)}>
                Okundu olarak işaretle
              </button>
            )}

            <button
              onClick={() => handleDelete(msg.id)}
              style={{ marginLeft: "10px" }}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
