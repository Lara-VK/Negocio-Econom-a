import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { createPortal } from 'react-dom'
import Home from './pages/Home'
import About from './pages/About'
import Listings from './pages/Listings'
import CreateProduct from './pages/CreateProduct'
import Register from './pages/Register'
import Login from './pages/Login'
import EditProduct from './pages/EditProduct'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/Dashboard'
import Demand from './pages/Demand'
import { getCurrentUser, logout } from './lib/auth'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastProvider, useToast } from './lib/toast.jsx'
import { ConfirmProvider } from './lib/confirm.jsx'
import Toasts from './components/Toasts'
import RequireAuth from './components/RequireAuth'
import Logo from './components/Logo'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const avatarRef = useRef(null)
  const dropdownRef = useRef(null)
  const [menuPos, setMenuPos] = useState({left:0, top:0})

  // keep local user state in sync with localStorage changes
  useEffect(() => {
    function onStorage(){ setMe(getCurrentUser()) }
    window.addEventListener('storage', onStorage)
    window.addEventListener('pe_user_change', onStorage)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('pe_user_change', onStorage) }
  }, [])

  // close menu when clicking outside or pressing Escape
  useEffect(() => {
    if(!menuOpen) return
    function onDown(e){
      const target = e.target
      if(avatarRef.current && avatarRef.current.contains(target)) return
      if(dropdownRef.current && dropdownRef.current.contains(target)) return
      setMenuOpen(false)
    }
    function onKey(e){ if(e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [menuOpen])

  // compute dropdown position when opening
  useEffect(()=>{
    if(!menuOpen) return
    const avatar = avatarRef.current
    if(!avatar) return
    function compute(){
      const rect = avatar.getBoundingClientRect()
      const dropdownWidth = 220
      let left = rect.right - dropdownWidth
      // ensure the menu does not overflow the viewport
      const maxLeft = window.innerWidth - dropdownWidth - 8
      if(left > maxLeft) left = maxLeft
      if(left < 8) left = rect.left < 8 ? 8 : rect.left
      const top = rect.bottom + window.scrollY + 8
      setMenuPos({ left, top })
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [menuOpen])

  function AuthLinks(){
    const user = me
      if(user) {
      const initials = (user.name || '').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()
      return (
        <div className="nav-profile" onBlur={()=>setMenuOpen(false)} tabIndex={0}>
            <button ref={avatarRef} className="avatar" onClick={()=>setMenuOpen(s=>!s)} aria-haspopup="true" aria-expanded={menuOpen}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                initials
              )}
            </button>
          {menuOpen && typeof document !== 'undefined' && createPortal(
            <div ref={dropdownRef} className="nav-dropdown" role="menu" style={{position:'absolute',left:menuPos.left+'px',top:menuPos.top+'px'}}>
              <div className="menu-user"><strong>{user.name}</strong><div className="small muted">{user.role}</div></div>
              <hr />
              <button className="btn ghost" onClick={()=>{ setMenuOpen(false); navigate('/profile') }}>Editar perfil</button>
              <button className="btn ghost" onClick={()=>{ setMenuOpen(false); navigate('/listings?mine=1') }}>Mis anuncios</button>
              {user.role === 'emprendedor' && (
                <>
                  <button className="btn ghost" onClick={()=>{ setMenuOpen(false); navigate('/dashboard') }}>Dashboard</button>
                  <button className="btn ghost" onClick={()=>{ setMenuOpen(false); navigate('/demand') }}>Demanda</button>
                </>
              )}
              <button className="btn ghost" onClick={()=>{ logout(); setMe(null); setMenuOpen(false); add('Sesión cerrada'); navigate('/') }}>Cerrar sesión</button>
            </div>, document.body
          )}
        </div>
      )
    }
    return (
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <NavLink to="/login" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Iniciar</NavLink>
        <NavLink to="/register" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Registro</NavLink>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div className="brand">
            <Logo size={48} />
            <div style={{display:'flex',flexDirection:'column'}}>
              <h1>Marketplace Estudiantil</h1>
              <small className="muted">Conecta. Vende. Crece.</small>
            </div>
          </div>
          <nav>
            <NavLink to="/" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Inicio</NavLink>
            <NavLink to="/listings" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Anuncios</NavLink>
            { me && me.role === 'emprendedor' ? (
              <>
                <NavLink to="/create" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Publicar</NavLink>
              </>
            ) : null }
            <NavLink to="/about" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Sobre</NavLink>
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
          <Route path="/profile" element={<RequireAuth><EditProfile/></RequireAuth>} />
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
