import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import MessageCard from "../components/MessageCard";
import "../CSS/ReceivedMessages.css";

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

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Mesajları sunucudan çeker
    if (!user?.id) return;
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/api/messages/received/${user.cardid}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (!response.ok) throw new Error("Mesajlar alınamadı");
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
    // Belirtilen mesajı siler ve arayüzü günceller
    if (!window.confirm("Mesajı silmek istediğinize emin misiniz?")) return;
    try {
      const response = await fetch(`${API_URL}/api/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Mesaj silinemedi");
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      alert(err.message || "Hata oluştu");
    }
  };

  const handleMarkAsRead = async (id) => {
    // Belirtilen mesajı okundu olarak işaretler ve sayacı günceller
    try {
      const response = await fetch(
        `${API_URL}/api/messages/${id}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ read: true }),
        }
      );
      if (!response.ok) throw new Error("Okundu olarak işaretlenemedi");
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
      );
      if (unreadMessageCount === 1) {
        setUnreadMessageCount(0);
        setHasUnreadMessages(false);
      } else {
        setUnreadMessageCount((prev) => prev - 1);
      }
    } catch (err) {
      alert(err.message || "Hata oluştu");
    }
  };

  return (
    <div className="container">
      {loading ? (
        <p>Mesajlar yükleniyor...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : messages.length === 0 ? (
        <p>Henüz mesaj almadınız.</p>
      ) : (
        <ul className="messageList">
          {messages.map((msg) => (
            <MessageCard
              key={msg.id}
              msg={msg}
              onDelete={handleDelete}
              onMarkAsRead={handleMarkAsRead}
              type="inbox"
            />
          ))}
        </ul>
      )}
    </div>
  );
}
