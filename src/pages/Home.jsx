import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, removeUsersByNames } from '../lib/auth'
import { useToast } from '../lib/toast.jsx'

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
    }catch(e){
      // no bloquear la UI si hay error
      console.error('Error al eliminar usuarios demo', e)
    }
  }, [])
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
