import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { Header } from '../components/header.jsx'
import { Menu } from '../components/menu.jsx'
import { Footer } from '../components/footer.jsx'
import { Login } from '../components/Login.jsx'
import { Dashboard } from '../components/Dashboard.jsx'

// Componente para manejar la visibilidad del Header y Footer
function AppContent() {
  const location = useLocation();

  // Definimos en qué rutas NO queremos que se vea el Header/Footer
  const hideLayout = location.pathname === '/dashboard';

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
