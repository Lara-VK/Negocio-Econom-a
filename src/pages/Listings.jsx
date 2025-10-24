import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts, deleteProduct } from '../lib/storage'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../lib/toast.jsx'

export default function Listings() {
  const [items, setItems] = useState([])

  const navigate = useNavigate()

  const user = getCurrentUser()
  const { add } = useToast()

  useEffect(() => {
    setItems(getProducts())
  }, [])

  function handleDelete(id){
    if(!confirm('¿Eliminar este producto?')) return
    deleteProduct(id)
    setItems(getProducts())
    add('Producto eliminado')
  }

  return (
    <section>
      <h2>Anuncios</h2>
      {user && user.role === 'emprendedor' ? (
        <p><Link to="/create">Publicar un nuevo producto</Link></p>
      ) : null}
      {items.length === 0 ? (
        <p>No hay productos aún. Sé el primero en publicar.</p>
      ) : (
        <div className="card-grid">
          {items.map(p => (
            <ProductCard key={p.id} product={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  )
}
