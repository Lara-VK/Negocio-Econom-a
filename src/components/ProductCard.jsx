
import React from 'react'
import { getCurrentUser } from '../lib/auth'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onDelete }) {
  const user = getCurrentUser()
  const canEdit = user && user.role === 'emprendedor' && user.id === product.ownerId

  return (
    <article className="card">
      <h3>{product.title}</h3>
      {product.image && <img src={product.image} alt={product.title} style={{maxWidth:'100%',borderRadius:6}}/>}
      <p>{product.description}</p>
      <p style={{fontWeight:700}}>{product.price ? `₡ ${product.price}` : 'Precio a consultar'}</p>

      {canEdit && (
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <Link to={`/edit/${product.id}`} className="btn secondary">Editar</Link>
          <button className="btn" onClick={()=>onDelete && onDelete(product.id)} style={{background:'#ef4444'}}>Eliminar</button>
        </div>
      )}
    </article>
  )
}
