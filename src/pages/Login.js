import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Şifre gösterme durumu
  const [loginStatus, setLoginStatus] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginStatus('success');
      navigate('/home');
    } catch (error) {
      console.error(error);
      setLoginStatus('error');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f2ef',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: 40,
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: 400,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h1
          style={{
            marginBottom: 24,
            fontSize: 28,
            color: '#0a66c2',
            fontWeight: '700',
          }}
        >
          DijitalKart'a Giriş Yap
        </h1>

        <form style={{ width: '100%' }} onSubmit={handleLogin} noValidate>
          <label
            htmlFor="email"
            style={{
              fontWeight: '600',
              fontSize: 14,
              color: '#333',
              marginBottom: 8,
              display: 'block',
            }}
          >
            Email adresi
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email adresinizi girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: 20,
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: 16,
              boxSizing: 'border-box',
              outlineColor: '#0a66c2',
              transition: 'border-color 0.3s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#0a66c2')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />

          <label
            htmlFor="password"
            style={{
              fontWeight: '600',
              fontSize: 14,
              color: '#333',
              marginBottom: 8,
              display: 'block',
            }}
          >
            Şifre
          </label>
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 40px 12px 16px', // Sağ tarafta buton için boşluk bıraktık
                borderRadius: 4,
                border: '1px solid #ccc',
                fontSize: 16,
                boxSizing: 'border-box',
                outlineColor: '#0a66c2',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0a66c2')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#0a66c2',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: 14,
                padding: 0,
                userSelect: 'none',
              }}
              aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
            >
              {showPassword ? 'Gizle' : 'Göster'}
            </button>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#0a66c2',
              color: 'white',
              padding: '14px 0',
              borderRadius: 4,
              border: 'none',
              fontWeight: '600',
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              marginBottom: 16,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#004182')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#0a66c2')}
          >
            Giriş Yap
          </button>
        </form>

        {loginStatus === 'error' && (
          <p
            style={{
              color: 'red',
              marginTop: 10,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            ❌ Email veya şifre hatalı.
          </p>
        )}

        <p style={{ marginTop: 30, fontSize: 14, color: '#555', textAlign: 'center' }}>
          Hesabınız yoksa,{' '}
          <Link
            to="/register"
            style={{
              color: '#0a66c2',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            oluşturun
          </Link>
          .
        </p>

        <p style={{ fontSize: 14, marginTop: 10, textAlign: 'center' }}>
          <Link
            to="/forgot-password"
            style={{
              color: '#0a66c2',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Şifrenizi mi unuttunuz?
          </Link>
        </p>
      </div>
    </div>
  );
}
