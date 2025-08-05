import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import HomePage from "./pages/app/Home";
import SettingsPage from "./pages/app/Settings";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthLayout from "./pages/AuthLayout";
import AppLayout from "./pages/AppLayout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route element={<AuthLayout />}>
                  <Route path="/login" index element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

         <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
