import { useState } from "react";
import { Link } from "react-router-dom";

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
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        setRegisterStatus("success");
        setEmail("");
        setUsername("");
        setPassword("");
      } else {
        // Backend'den gelen hata mesajını alabiliriz
        const data = await response.json();
        setRegisterStatus(data.message || "error");
      }
    } catch (error) {
      console.error(error);
      setRegisterStatus("error");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f2ef",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 40,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: 400,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginBottom: 24, fontSize: 28, color: "#0a66c2" }}>
          DijitalKart'a Kayıt Ol
        </h1>

        <form style={{ width: "100%" }} onSubmit={handleRegister}>
          <label htmlFor="username" style={labelStyle}>
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
            style={inputStyle}
          />
          {usernameError && (
            <p style={{ color: "red", fontSize: 13, marginBottom: 10 }}>
              {usernameError}
            </p>
          )}

          <label htmlFor="email" style={labelStyle}>
            Email adresi
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email adresinizi girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <label htmlFor="password" style={labelStyle}>
            Şifre
          </label>
          <input
            id="password"
            type="password"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = "#004182";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = "#0a66c2";
            }}
          >
            {loading ? "Kayıt oluyor..." : "Kayıt Ol"}
          </button>
        </form>

        {registerStatus === "success" && (
          <p style={{ color: "green", marginTop: 20 }}>✅ Kayıt başarılı!</p>
        )}
        {registerStatus && registerStatus !== "success" && registerStatus !== "error" && (
          <p style={{ color: "red", marginTop: 20 }}>{registerStatus}</p>
        )}
        {registerStatus === "error" && (
          <p style={{ color: "red", marginTop: 20 }}>
            ❌ Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.
          </p>
        )}

        <p style={{ marginTop: 30, fontSize: 14, color: "#555" }}>
          Hesabınız zaten varsa,{" "}
          <Link
            to="/login"
            style={{
              color: "#0a66c2",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            giriş yapın
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  marginBottom: 20,
  borderRadius: 4,
  border: "1px solid #ccc",
  fontSize: 16,
  boxSizing: "border-box",
  outlineColor: "#0a66c2",
};

const labelStyle = {
  fontWeight: "600",
  fontSize: 14,
  color: "#333",
  marginBottom: 8,
  display: "block",
};

const buttonStyle = {
  width: "100%",
  backgroundColor: "#0a66c2",
  color: "white",
  padding: "14px 0",
  borderRadius: 4,
  border: "none",
  fontWeight: "600",
  fontSize: 16,
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};
