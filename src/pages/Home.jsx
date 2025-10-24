import React from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'

export default function Home() {
  const user = getCurrentUser()
  return (
    <section>
      <div className="hero">
        <div className="hero-copy">
          <h2>Marketplace Estudiantil</h2>
          <p>Un espacio digital seguro y accesible para que estudiantes universitarios publiquen, promocionen y comercialicen sus productos y servicios.</p>
          <div className="cta">
            <Link className="btn" to="/listings">Ver anuncios</Link>
            {user && user.role === 'emprendedor' && (
              <Link className="btn secondary" to="/create" style={{marginLeft:8}}>Publicar</Link>
            )}
          </div>
        </div>
        <div className="hero-media">
          <div className="logo" style={{width:160,height:160,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:12,background:'linear-gradient(135deg,#0ea5a4,#06b6d4)',color:'white',fontSize:28,fontWeight:700}}>ME</div>
        </div>
      </div>

      <div className="card-grid">
        <article className="card">
          <h3>Ejemplo de producto</h3>
          <p>Descripción breve del producto o servicio.</p>
        </article>
      </div>
    </section>
  )
}
