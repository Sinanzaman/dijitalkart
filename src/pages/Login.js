import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../CSS/Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const { setUser, setTheme } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    // Form submit edildiğinde çalışan, Firebase ve backend doğrulaması yapan giriş fonksiyonu.
    e.preventDefault();
    setLoginStatus(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const updateResponse = await fetch(`${API_URL}/api/auth/update-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!updateResponse.ok) {
        console.warn("Backend şifre güncellemesi başarısız olabilir.");
      }
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setTheme(data.user.theme);
        navigate("/home");
        setLoginStatus("success");
      } else {
        setLoginStatus("error");
      }
    } catch (firebaseError) {
      setLoginStatus("error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">DijitalKart'a Giriş Yap</h1>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          <label htmlFor="email" className="login-label">
            Email adresi
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email adresinizi girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />

          <label htmlFor="password" className="login-label">
            Şifre
          </label>
          <div className="login-password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="login-toggle-password"
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {!showPassword ? <FiEyeOff size={25} /> : <FiEye size={25} />}
            </button>
          </div>

          <button type="submit" className="login-button">
            Giriş Yap
          </button>
        </form>

        {loginStatus === "error" && (
          <p className="login-error-message">❌ Email veya şifre hatalı.</p>
        )}

        <p className="login-bottom-text">
          Hesabınız yoksa,{" "}
          <Link to="/register" className="login-link">
            oluşturun
          </Link>
          .
        </p>

        <p className="login-bottom-text">
          <Link to="/forgot-password" className="login-link">
            Şifrenizi mi unuttunuz?
          </Link>
        </p>
      </div>

      {/* Sayfanın en altında, sabit buton */}
      <button
        type="button"
        className="info-button"
        onClick={() => setShowInfoPanel(!showInfoPanel)}
      >
        DijitalKart Nedir?
      </button>

      {/* Açılır bilgi paneli */}
      {showInfoPanel && (
        <div className="info-panel">
          <h2>DijitalKart Nedir?</h2>
          <p>
            DijitalKart, dijital kartvizitlerinizi kolayca oluşturabileceğiniz, paylaşabileceğiniz ve yönetebileceğiniz yenilikçi bir uygulamadır.
            Kartvizit bilgilerinizi güncellemek, farklı temalar kullanmak ve profesyonel görünümler oluşturmak artık çok kolay.
          </p>
          <button
            type="button"
            className="close-info-button"
            onClick={() => setShowInfoPanel(false)}
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
}
