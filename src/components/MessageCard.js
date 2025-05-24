import "../CSS/MessageCard.css";
import { FaRegCopy } from "react-icons/fa";

export default function MessageCard({
  msg,
  onDelete,
  onMarkAsRead,
  type = "inbox",
}) {
  const isInbox = type === "inbox";
  const infoLabel = isInbox ? "Gönderen" : "Alıcı";
  const infoValue = isInbox ? msg.senderCardId : msg.recipientCardId;

  const handleCopy = () => {
    if (infoValue) {
      navigator.clipboard.writeText(infoValue);
      alert(`${infoLabel} ID kopyalandı!`);
    }
  };

  return (
    <li className={`messageItem ${msg.read ? "read" : "unread"}`}>
      <h3 className="messageTitle">{msg.title}</h3>
      <p className="messageBody">{msg.body}</p>

      <p className="senderInfo">
        <strong>{infoLabel}:</strong> {infoValue || "Bilinmiyor"}
        {isInbox && infoValue && (
          <span
            onClick={handleCopy}
            title="Kopyala"
            style={{
              cursor: "pointer",
              marginLeft: "8px",
              fontSize: "1.1em",
              userSelect: "none",
              color: "#007bff",
            }}
          >
            <FaRegCopy />
          </span>
        )}
      </p>

      <p className="timestamp">
        Gönderim Tarihi:{" "}
        {new Date(msg.timestamp).toLocaleString("tr-TR", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </p>

      {isInbox && (
        <>
          <p className={`status ${msg.read ? "read" : "unread"}`}>
            Durum: {msg.read ? "Okundu" : "Okunmadı"}
          </p>

          {!msg.read && (
            <button className="button" onClick={() => onMarkAsRead(msg.id)}>
              Okundu olarak işaretle
            </button>
          )}
        </>
      )}

      <button className="button delete" onClick={() => onDelete(msg.id)}>
        Sil
      </button>
    </li>
  );
}
