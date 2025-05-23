import { useState } from "react";
import {
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import "../CSS/UserSettings.css";

export default function UserSettings() {
  const user = auth.currentUser;

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Ayrı ayrı current password state'leri
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState("");
  const [currentPasswordForDelete, setCurrentPasswordForDelete] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const reauthenticate = async (password) => {
    if (!user || !user.email) throw new Error("Kullanıcı bulunamadı");

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  };

  const handleChangeEmail = async () => {
    setMessage("");
    setError("");
    try {
      await reauthenticate(currentPasswordForEmail);
      await updateEmail(user, newEmail);
      setMessage("E-posta başarıyla güncellendi!");
      setNewEmail("");
      setCurrentPasswordForEmail("");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleChangePassword = async () => {
    setMessage("");
    setError("");
    try {
      await reauthenticate(currentPasswordForPassword);
      await updatePassword(user, newPassword);
      setMessage("Şifre başarıyla güncellendi!");
      setNewPassword("");
      setCurrentPasswordForPassword("");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeleteAccount = async () => {
    setMessage("");
    setError("");

    if (!window.confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }

    try {
      await reauthenticate(currentPasswordForDelete);
      await deleteUser(user);
      setMessage("Hesabınız silindi.");
      setCurrentPasswordForDelete("");
    } catch (e) {
      setError(e.message);
    }
  };

  if (!user) return <p className="user-settings-message">Kullanıcı oturumu açık değil.</p>;

  return (
    <div className="user-settings-container">
      <h2 className="user-settings-title">Kullanıcı Ayarları</h2>

      {message && <p className="user-settings-message success">{message}</p>}
      {error && <p className="user-settings-message error">{error}</p>}

      <section className="user-settings-section">
        <h3 className="user-settings-subtitle">E-posta Değişikliği</h3>
        <input
          type="email"
          className="user-settings-input"
          placeholder="Yeni e-posta"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <input
          type="password"
          className="user-settings-input"
          placeholder="Mevcut şifrenizi girin (doğrulama için)"
          value={currentPasswordForEmail}
          onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
        />
        <button className="user-settings-button" onClick={handleChangeEmail}>
          E-postayı Güncelle
        </button>
      </section>

      <section className="user-settings-section">
        <h3 className="user-settings-subtitle">Şifre Değişikliği</h3>
        <input
          type="password"
          className="user-settings-input"
          placeholder="Yeni şifre"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          className="user-settings-input"
          placeholder="Mevcut şifrenizi girin (doğrulama için)"
          value={currentPasswordForPassword}
          onChange={(e) => setCurrentPasswordForPassword(e.target.value)}
        />
        <button className="user-settings-button" onClick={handleChangePassword}>
          Şifreyi Güncelle
        </button>
      </section>

      <section className="user-settings-section">
        <h3 className="user-settings-subtitle">Hesabı Sil</h3>
        <input
          type="password"
          className="user-settings-input"
          placeholder="Mevcut şifrenizi girin (doğrulama için)"
          value={currentPasswordForDelete}
          onChange={(e) => setCurrentPasswordForDelete(e.target.value)}
        />
        <button className="user-settings-button delete" onClick={handleDeleteAccount}>
          Hesabı Sil
        </button>
      </section>
    </div>
  );
}
