import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Victims from "./pages/Victims";
import Authors from "./pages/Authors";
import AuthorQuestionnaires from "./pages/AuthorQuestionnaires";
import VictimQuestionnaires from "./pages/VictimQuestionnaires";
import "./App.css";

// Rota pública (bloqueia acesso se já estiver autenticado)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Rota inicial condicional
const InitialRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

   /* console.log("🔐 Estado auth:", { isAuthenticated, loading, user }); */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rota inicial condicional */}
          <Route path="/" element={<InitialRoute />} />

          {/* Rotas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/victims"
            element={
              <ProtectedRoute>
                <Victims />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authors"
            element={
              <ProtectedRoute>
                <Authors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/author-questionnaires"
            element={
              <ProtectedRoute>
                <AuthorQuestionnaires />
              </ProtectedRoute>
            }
          />
          <Route
            path="/victim-questionnaires"
            element={
              <ProtectedRoute>
                <VictimQuestionnaires />
              </ProtectedRoute>
            }
          />

          {/* Página 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Página não encontrada</p>
                  <a
                    href="/"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Voltar ao início
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
