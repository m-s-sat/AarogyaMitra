import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { Header } from './components/Header.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { SignupPage } from './pages/SignupPage.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { AppointmentsPage } from './pages/AppointmentsPage.tsx';
import { EmergencyPage } from './pages/EmergencyPage.tsx';
import { ChatPage } from './pages/ChatPage.tsx';
import { PasswordResetPage } from "./pages/PasswordResetPage.tsx";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/password-reset"
            element={<PasswordResetPage />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency"
            element={
              <ProtectedRoute>
                <EmergencyPage />
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Reports Page</h1>
                    <p className="text-gray-600">Coming soon - View and manage your medical reports</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Medicines Page</h1>
                    <p className="text-gray-600">Coming soon - Track your medication schedule</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/visits"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Visits</h1>
                    <p className="text-gray-600">Coming soon - View your scheduled appointments</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/helpdesk"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Helpdesk</h1>
                    <p className="text-gray-600">Coming soon - 24/7 medical assistance</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;