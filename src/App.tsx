import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import HomePage from "./pages/app/Home";
import SettingsPage from "./pages/app/Settings";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthLayout from "./pages/AuthLayout";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

         <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
