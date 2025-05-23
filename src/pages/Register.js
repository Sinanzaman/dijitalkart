import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import "../CSS/Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateUsername = (value) => {
    const valid = /^[a-zA-Z0-9_]{1,30}$/.test(value);
    if (!valid) {
      setUsernameError(
        "Kullanıcı adı yalnızca harf, rakam ve alt çizgi (_) içerebilir (en fazla 30 karakter)."
      );
    } else {
      setUsernameError(null);
    }
    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterStatus(null);

    if (!validateUsername(username)) return;

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          cardid: userCredential.user.uid,
        }),
      });
      if (response.ok) {
        setRegisterStatus("success");
        setEmail("");
        setUsername("");
        setPassword("");
      } else {
        const data = await response.json();
        setRegisterStatus(data.message || "error");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      if (error.code && error.code.startsWith("auth/")) {
        setRegisterStatus(error.message); // Firebase hataları
      } else {
        setRegisterStatus("error");
      }
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">DijitalKart'a Kayıt Ol</h1>

        <form className="register-form" onSubmit={handleRegister}>
          <label htmlFor="username" className="register-label">
            Kullanıcı adı
          </label>
          <input
            id="username"
            type="text"
            placeholder="Kullanıcı adınızı girin"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              validateUsername(e.target.value);
            }}
            maxLength={30}
            required
            className="register-input"
          />
          {usernameError && (
            <p className="register-error">{usernameError}</p>
          )}

          <label htmlFor="email" className="register-label">
            Email adresi
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email adresinizi girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />

          <label htmlFor="password" className="register-label">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="register-button"
          >
            {loading ? "Kayıt oluyor..." : "Kayıt Ol"}
          </button>
        </form>

        {registerStatus === "success" && (
          <p className="register-success-message">✅ Kayıt başarılı!</p>
        )}
        {registerStatus &&
          registerStatus !== "success" &&
          registerStatus !== "error" && (
            <p className="register-error-message">{registerStatus}</p>
          )}
        {registerStatus === "error" && (
          <p className="register-error-message">
            ❌ Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.
          </p>
        )}

        <p className="register-bottom-text">
          Hesabınız zaten varsa,{" "}
          <Link to="/login" className="register-link">
            giriş yapın
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
