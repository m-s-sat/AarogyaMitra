import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HospitalSignupPage } from './pages/HospitalSignUpPage.tsx';
import { Dashboard } from './pages/Dashboard';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ChatPage } from './pages/ChatPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyMedicinesPage } from './pages/MyMedicinesPage';
import { HelpdeskPage } from './pages/HelpdeskPage';
import { HospitalDashboard } from './pages/HospitalDashboard';

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
            path="/signup/hospital" 
            element={
              <PublicRoute>
                <HospitalSignupPage />
              </PublicRoute>
            } 
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

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />


          {/* Placeholder routes for other pages */}
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
                <MyMedicinesPage />
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
                <HelpdeskPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mymedicines" 
            element={
              <ProtectedRoute>
                <MyMedicinesPage />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
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