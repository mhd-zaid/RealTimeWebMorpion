import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import extend_theme from './utils/chakra-theme.js';
import './index.css';
import { ProtectedRoute } from './layouts/ProtectedRoute.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import App from './App.jsx';
import Home from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgetPasswordPage from './pages/auth/ForgetPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import EmailVerifiedPage from './pages/auth/EmailVerifiedPage.jsx';
import GameBoardPage from "@/pages/GameBoardPage.jsx";
import PartyOnlinePage from "@/pages/party/PartyOnlinePage.jsx";
import PartyLocalPage from "@/pages/party/PartyLocalPage.jsx";
import PartiesPage from "@/pages/party/PartiesPage.jsx";

const theme = extendTheme(extend_theme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<App />}>
            <Route element={<ProtectedRoute />}>
              <Route index element={<GameBoardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="gameboard">
                <Route index element={<GameBoardPage />} />
                <Route path="general" element={<PartiesPage />} />
                <Route path="room" element={<PartyLocalPage />} />
                <Route path="room/:id" element={<PartyOnlinePage />} />
                <Route path={"chat"} element={<Home />} />
              </Route>
            </Route>
          </Route>

          <Route path="/" element={<App />}>
            <Route path="auth">
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgetpassword" element={<ForgetPasswordPage />} />
              <Route path="resetpassword/:token" element={<ResetPasswordPage />} />
              <Route path="verify" element={<EmailVerifiedPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
);
