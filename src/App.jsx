import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Listings from './pages/Listings'
import CreateProduct from './pages/CreateProduct'
import Register from './pages/Register'
import Login from './pages/Login'
import EditProduct from './pages/EditProduct'
import Dashboard from './pages/Dashboard'
import Demand from './pages/Demand'
import { getCurrentUser, logout } from './lib/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastProvider, useToast } from './lib/toast.jsx'
import { ConfirmProvider } from './lib/confirm.jsx'
import Toasts from './components/Toasts'
import RequireAuth from './components/RequireAuth'

export default function App(){
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AppContent />
      </ConfirmProvider>
      <Toasts />
    </ToastProvider>
  )
}

function AppContent(){
  const [me, setMe] = useState(()=>getCurrentUser())
  const navigate = useNavigate()
  const { add } = useToast()

  function AuthLinks(){
    const user = getCurrentUser()
    if(user) return (
      <span style={{marginLeft:12}}>
        <strong style={{marginRight:8}}>{user.name}</strong>
        <button className="btn secondary" onClick={()=>{logout(); setMe(null); add('Sesión cerrada'); navigate('/')}}>Cerrar sesión</button>
      </span>
    )
    return (
      <span style={{marginLeft:12}}>
        <Link to="/login">Iniciar</Link>
        <Link to="/register" style={{marginLeft:8}}>Registro</Link>
      </span>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div className="brand">
            <div className="logo">ME</div>
            <h1>Marketplace Estudiantil</h1>
          </div>
          <nav>
            <Link to="/">Inicio</Link>
            <Link to="/listings">Anuncios</Link>
            { (getCurrentUser() && getCurrentUser().role === 'emprendedor') && (
              <>
                <Link to="/create">Publicar</Link>
                <Link to="/demand" style={{marginLeft:8}}>Demanda</Link>
                <Link to="/dashboard" style={{marginLeft:8}}>Dashboard</Link>
              </>
            )}
            <Link to="/about">Sobre</Link>
            { /* auth links */ }
            <AuthLinks />
          </nav>
        </div>
      </header>
      <main className="app-main">
        <div className="container">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/demand" element={<RequireAuth role="emprendedor"><Demand/></RequireAuth>} />
          <Route path="/create" element={<RequireAuth role="emprendedor"><CreateProduct/></RequireAuth>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edit/:id" element={<RequireAuth role="emprendedor"><EditProduct/></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth role="emprendedor"><Dashboard/></RequireAuth>} />
          <Route path="/about" element={<About />} />
        </Routes>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <small>Proyecto IF6200 — Marketplace Estudiantil · Integrantes: Dayron Ortiz Alvarado, Kevin Lara Valverde · 2025</small>
        </div>
      </footer>
    </div>
  )
}
