import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Header } from '../components/header.jsx'
import { Menu } from '../components/menu.jsx'
import { Footer } from '../components/footer.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Menu />
      <Footer />
    </>
  )
}

export default App
