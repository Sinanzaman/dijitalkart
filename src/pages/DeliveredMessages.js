import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function DeliveredMessages() {
  const { user } = useUser();
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
          `http://localhost:8080/api/messages/sent/${user.cardid}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Gönderilen mesajlar alınamadı");
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
      !window.confirm("Silmek istediğine emin misin? Bu işlem geri alınamaz.")
    )
      return;

    try {
      const response = await fetch(`http://localhost:8080/api/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Mesaj silinemedi");

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      alert(err.message || "Silme işlemi sırasında hata oluştu");
    }
  };

  if (loading) return <p>Mesajlar yükleniyor...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (messages.length === 0) return <p>Henüz mesaj göndermediniz.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.map((msg, index) => (
          <li
            key={index} // Eğer mesajda id yoksa index kullanabiliriz
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "#f0f8ff",
            }}
          >
            <h3>{msg.title}</h3>
            <p>{msg.body}</p>
            <p>
              <strong>Alıcı:</strong> {msg.recipientCardId || "Bilinmiyor"}
            </p>
            <p style={{ fontSize: "0.9em", color: "#666" }}>
              Gönderim Tarihi:{" "}
              {new Date(msg.timestamp).toLocaleString("tr-TR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
            <button onClick={() => handleDelete(msg.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
