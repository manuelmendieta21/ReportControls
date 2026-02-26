import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { Header } from '../components/header.jsx'
import { Menu } from '../components/menu.jsx'
import { Footer } from '../components/footer.jsx'
import { Login } from '../components/Login.jsx'
import { Dashboard } from '../components/Dashboard.jsx'
import { ReportProcessor } from '../components/ReportProcessor.jsx'
import { ProtectedRoute } from '../components/ProtectedRoute.jsx'
import { ReportProvider } from '../context/ReportContext.jsx'

// Componente para manejar la visibilidad del Header y Footer
function AppContent() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("user");

  // Ocultamos Header/Footer si estamos en /dashboard O si el usuario está logueado (sesión activa)
  // Esto asegura que dentro de la app no se vea el sitio público si ya inició sesión
  const hideLayout = location.pathname === '/dashboard' || (isLoggedIn && location.pathname !== '/');

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportProcessor />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <ReportProvider>
      <Router>
        <AppContent />
      </Router>
    </ReportProvider>
  )
}

export default App
