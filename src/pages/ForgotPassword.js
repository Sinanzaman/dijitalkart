import { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/ForgotPassword.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Şifre sıfırlama maili gönderildi. Lütfen emailinizi kontrol edin.');
      setLoading(false);
    } catch (err) {
      setError('Bir hata oluştu veya email kayıtlı değil.');
      console.error(err);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h1 className="forgot-title">Şifremi Unuttum</h1>

        <form className="forgot-form" onSubmit={handleReset} noValidate>
          <label htmlFor="email" className="forgot-label">
            Email adresinizi girin
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="forgot-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="forgot-button"
          >
            {loading ? "Gönderiliyor..." : "Şifre Sıfırlama Maili Gönder"}
          </button>
        </form>

        {message && <p className="forgot-success">{message}</p>}
        {error && <p className="forgot-error">{error}</p>}

        <p className="forgot-link">
          <Link to="/login" className="forgot-back-link">
            Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </div>
  );
}
