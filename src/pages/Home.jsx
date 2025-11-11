import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, removeUsersByNames } from '../lib/auth'
import { useToast } from '../lib/toast.jsx'
import { removeProductsByTitle } from '../lib/storage'

export default function Home() {
  const user = getCurrentUser()
  const toast = useToast()

  useEffect(()=>{
    // Eliminar usuarios demo si existen
    try{
      const removed = removeUsersByNames(['ana','carlos'])
      if(removed && removed.length){
        toast.add(`Usuarios eliminados: ${removed.join(', ')}`)
      }
      // Eliminar producto problemático llamado 'xd' si existe
      try{
        const removedP = removeProductsByTitle(['xd'])
        if(removedP && removedP.length){
          toast.add(`Productos eliminados: ${removedP.join(', ')}`)
        }
      }catch(e){ console.error('Error al eliminar producto xd', e) }
    }catch(e){
      // no bloquear la UI si hay error
      console.error('Error al eliminar usuarios demo', e)
    }
  }, [])
  return (
    <section>
      <div className="hero hero-feature">
        <div className="hero-copy">
          <h2>Vende con estilo. Llega a tu comunidad.</h2>
          <p className="muted">Marketplace Estudiantil conecta emprendedores y clientes dentro de la universidad. Publica tus productos, gestiona ventas y observa tu progreso con métricas claras.</p>

          <div className="cta">
            <Link className="btn action" to="/listings">Ver anuncios</Link>
            {user && user.role === 'emprendedor' && (
              <Link className="btn secondary" to="/create" style={{marginLeft:12}}>Publicar</Link>
            )}
          </div>

          <div className="hero-features">
            <div className="feature"><strong>Fácil publicación</strong><span className="small muted">Sube foto, precio y contacto</span></div>
            <div className="feature"><strong>Dashboard</strong><span className="small muted">Controla utilidades y metas por producto</span></div>
            <div className="feature"><strong>Seguro</strong><span className="small muted">Control de roles y permisos</span></div>
          </div>
        </div>

        <div className="hero-media">
          <div className="hero-art">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="hero-card">
              <h4>Productos destacados</h4>
              <p className="small muted">Encuentra ofertas exclusivas de estudiantes emprendedores.</p>
              <div className="mini-grid">
                <div className="mini-item" />
                <div className="mini-item" />
                <div className="mini-item" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-grid">
        <article className="card">
          <h3>Empieza ahora</h3>
          <p>Regístrate como emprendedor y publica tu primer producto en minutos.</p>
        </article>
      </div>
    </section>
  )
}
