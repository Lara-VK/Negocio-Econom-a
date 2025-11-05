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

  async function handleBuy(productId){
    const user = getCurrentUser()
    if(!user) return navigate('/login')
    try{
      const all = getProducts()
      const prod = all.find(p=>p.id===productId)
      const contact = prod?.contact || prod?.ownerContact || prod?.ownerName || 'No disponible'
      const msg = `Contacto del vendedor: ${contact}\n\n¿Deseas registrar la compra para actualizar las estadísticas?`
      if(window.confirm(msg)){
        await import('../lib/api').then(m=>m.recordSale(productId))
        setItems(getProducts())
        add('Compra registrada. El emprendedor verá el cambio en sus estadísticas.')
      } else {
        // show contact so user can copy it
        alert(`Contacto del vendedor:\n${contact}`)
      }
    }catch(err){
      alert(err.message)
    }
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
            <ProductCard key={p.id} product={p} onDelete={handleDelete} onBuy={handleBuy} />
          ))}
        </div>
      )}
    </section>
  )
}
