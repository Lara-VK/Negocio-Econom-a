
import React from 'react'
import { getCurrentUser } from '../lib/auth'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onDelete, onBuy }) {
  const user = getCurrentUser()
  const canEdit = user && user.role === 'emprendedor' && user.id === product.ownerId
  const canBuy = user && user.role === 'cliente'

  return (
    <article className="card product-card">
      <div className="card-media">
        {product.image ? (
          <img src={product.image} alt={product.title} />
        ) : (
          <div className="media-placeholder">Sin imagen</div>
        )}
        <div className="price-badge">{product.price ? `₡ ${product.price}` : 'Consultar'}</div>
      </div>
      <div className="card-body">
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {product.ownerAvatar ? (
            <img src={product.ownerAvatar} alt={product.ownerName} style={{width:36,height:36,borderRadius:999,objectFit:'cover'}} />
          ) : (
            <div style={{width:36,height:36,borderRadius:999,background:'linear-gradient(90deg,#06b6d4,#10b981)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{(product.ownerName||'')[0]||'U'}</div>
          )}
          <div>
            <h3 style={{margin:0}}>{product.title}</h3>
            <div className="small muted">{product.ownerName}</div>
          </div>
        </div>
        <p className="muted small" style={{marginTop:8}}>{product.description}</p>
      </div>

      <div className="product-actions">
        {canEdit && (
          <>
            <Link to={`/edit/${product.id}`} className="btn secondary">Editar</Link>
            <button className="btn danger" onClick={()=>onDelete && onDelete(product.id)}>Eliminar</button>
          </>
        )}

        {canBuy && (
          <button className="btn primary-loud" onClick={()=>onBuy && onBuy(product.id)}>Comprar</button>
        )}

        {!user && (
          <Link to="/login" className="btn">Iniciar sesión para comprar</Link>
        )}
      </div>
    </article>
  )
}
