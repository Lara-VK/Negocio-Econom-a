import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts, deleteProduct } from '../lib/storage'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../lib/toast.jsx'
import { useConfirm } from '../lib/confirm.jsx'

export default function Listings() {
  const [items, setItems] = useState([])

  const navigate = useNavigate()

  const user = getCurrentUser()
  const { add } = useToast()
  const confirm = useConfirm()

  useEffect(() => {
    setItems(getProducts())
  }, [])

  async function handleDelete(id){
    const ok = await confirm('¿Eliminar este producto?', { okText: 'Eliminar', cancelText: 'Cancelar' })
    if(!ok) return
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
      const ok = await confirm(msg, { okText: 'Registrar', cancelText: 'Mostrar contacto' })
      if(ok){
        const api = await import('../lib/api')
        await api.recordSale(productId)
        const purchases = await import('../lib/purchases')
        purchases.savePurchase({ productId, ownerId: prod.ownerId, title: prod.title, qty: 1, buyer: user.name, price: prod.price })
        setItems(getProducts())
        add('Compra registrada. El emprendedor verá la demanda en su apartado.')
      } else {
        // show contact via toast so user can copy it
        add(`Contacto: ${contact}`)
      }
    }catch(err){
      console.error(err)
      add(err.message || 'Error al procesar la compra')
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
