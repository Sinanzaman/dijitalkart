import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import { UserProvider, useUser } from "./contexts/UserContext"; // <== import ettik

function AppRoutes() {
  const { firebaseUser, loading } = useUser();

  if (loading) {
    return (
      <div style={{ display:'flex', width: '100%', height:'100%', alignItems:'center', justifyContent:'center' }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!firebaseUser ? <Login /> : <Navigate to="/home" replace />} />
      <Route path="/register" element={!firebaseUser ? <Register /> : <Navigate to="/home" replace />} />
      <Route path="/forgot-password" element={!firebaseUser ? <ForgotPassword /> : <Navigate to="/home" replace />} />
      <Route path="/home" element={firebaseUser ? <Home /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={firebaseUser ? "/home" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
