
import React from 'react'
import { getCurrentUser } from '../lib/auth'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onDelete, onBuy }) {
  const user = getCurrentUser()
  const canEdit = user && user.role === 'emprendedor' && user.id === product.ownerId
  const canBuy = user && user.role === 'cliente'

  return (
    <article className="card">
      <h3>{product.title}</h3>
      {product.image && <img src={product.image} alt={product.title} style={{maxWidth:'100%',borderRadius:8}}/>}
      <p>{product.description}</p>
      <p style={{fontWeight:700}}>{product.price ? `₡ ${product.price}` : 'Precio a consultar'}</p>

      {canEdit && (
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <Link to={`/edit/${product.id}`} className="btn secondary">Editar</Link>
          <button className="btn danger" onClick={()=>onDelete && onDelete(product.id)}>Eliminar</button>
        </div>
      )}

      {canBuy && (
        <div style={{marginTop:8}}>
          <button className="btn" onClick={()=>onBuy && onBuy(product.id)}>Comprar</button>
        </div>
      )}
      {!user && (
        <div style={{marginTop:8}}>
          <Link to="/login" className="btn">Iniciar sesión para comprar</Link>
        </div>
      )}
    </article>
  )
}
