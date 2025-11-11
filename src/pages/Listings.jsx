import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts, deleteProduct } from '../lib/storage'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../lib/toast.jsx'
import { useConfirm } from '../lib/confirm.jsx'

export default function Listings() {
  const [items, setItems] = useState([])

  const navigate = useNavigate()
  const location = useLocation()

  const user = getCurrentUser()
  const { add } = useToast()
  const confirm = useConfirm()
  const [modal, setModal] = useState(null) // { prod }

  useEffect(() => {
    const all = getProducts()
    const params = new URLSearchParams(location.search)
    const mine = params.get('mine')
    if(mine && user){
      setItems(all.filter(p => p.ownerId === user.id))
    }else{
      setItems(all)
    }
  }, [location.search])

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
      if(!prod) throw new Error('Producto no encontrado')
      // ask confirmation to contact the seller first
      const ok = await confirm('¿Contactar al vendedor para comprar este producto?', { okText: 'Contactar', cancelText: 'Cancelar' })
      if(!ok) return
      // register sale and then show seller info modal
      await confirmRegisterSale(prod)
    }catch(err){
      console.error(err)
      add(err.message || 'Error al procesar la compra')
    }
  }

  async function confirmRegisterSale(prod){
    try{
      const api = await import('../lib/api')
      await api.recordSale(prod.id)
      const purchases = await import('../lib/purchases')
      const user = getCurrentUser()
      purchases.savePurchase({ productId: prod.id, ownerId: prod.ownerId, title: prod.title, qty: 1, buyer: user.name, price: prod.price })
      setItems(getProducts())
      add('Compra registrada. El emprendedor verá la demanda en su apartado.')
      // after registering the sale, show seller info modal so buyer can contact
      setModal({ prod })
    }catch(e){ console.error(e); add('Error al registrar la compra') }
  }

  function closeModal(){ setModal(null) }

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

      {modal && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(2,6,23,0.5)',zIndex:9999}}>
          <div style={{width:420,maxWidth:'94%',background:'var(--surface)',padding:18,borderRadius:12,boxShadow:'0 18px 40px rgba(11,18,32,0.18)'}}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              {modal.prod.ownerAvatar ? (
                <img src={modal.prod.ownerAvatar} alt={modal.prod.ownerName} style={{width:72,height:72,borderRadius:999,objectFit:'cover'}} />
              ) : (
                <div style={{width:72,height:72,borderRadius:999,background:'linear-gradient(90deg,#06b6d4,#10b981)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{(modal.prod.ownerName||'')[0]||'U'}</div>
              )}
              <div>
                <h3 style={{margin:0}}>{modal.prod.title}</h3>
                <div className="small muted">Vendedor: {modal.prod.ownerName}</div>
                <div className="small" style={{marginTop:6}}>Contacto: {modal.prod.ownerContact || 'No disponible'}</div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:14}}>
              <button className="btn secondary" onClick={closeModal}>Cerrar</button>
              <button className="btn" onClick={()=>confirmRegisterSale(modal.prod)}>Registrar compra</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
