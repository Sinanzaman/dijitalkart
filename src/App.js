import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CardDesign from "./pages/CardDesign";
import { UserProvider, useUser } from "./contexts/UserContext"; // Context importu

function AppRoutes() {
  const { user, loading } = useUser(); // ✅ firebaseUser yerine user kullanıyoruz

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Yükleniyor...
      </div>
    );
  } else {
    return (
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/forgot-password"
          element={!user ? <ForgotPassword /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/carddesign"
          element={user ? <CardDesign /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/login"} replace />}
        />
      </Routes>
    );
  }
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
