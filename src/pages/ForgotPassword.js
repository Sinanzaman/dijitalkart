import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Şifre sıfırlama maili gönderildi. Lütfen emailinizi kontrol edin.');
    } catch (err) {
      setError('Bir hata oluştu veya email kayıtlı değil.');
      console.error(err);
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
        }}
      >
        <h1 style={{ marginBottom: 24, fontSize: 28, color: '#0a66c2' }}>
          Şifremi Unuttum
        </h1>

        <form style={{ width: '100%' }} onSubmit={handleReset}>
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
            Email adresinizi girin
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email adresiniz"
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
            }}
          />

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
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#004182')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#0a66c2')}
          >
            Şifre Sıfırlama Maili Gönder
          </button>
        </form>

        {message && <p style={{ color: 'green', marginTop: 20 }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: 20 }}>{error}</p>}

        <p style={{ marginTop: 30, fontSize: 14, color: '#555' }}>
          <Link
            to="/login"
            style={{
              color: '#0a66c2',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </div>
  );
}
