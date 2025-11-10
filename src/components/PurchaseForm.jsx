import React, { useState } from 'react'
import { useToast } from '../lib/toast.jsx'

export default function PurchaseForm({ product, onSave, initialQty = 1 }){
  const [qty, setQty] = useState(initialQty)
  const [buyer, setBuyer] = useState('')
  const [loading, setLoading] = useState(false)
  const price = Number(product?.price) || 0

  const { add } = useToast()

  async function submit(e){
    e.preventDefault()
    const q = Number(qty) || 0
    if(q <= 0){ add('Ingrese una cantidad válida'); return }
    setLoading(true)
    try{
      await onSave({ productId: product.id, qty: q, buyer: buyer || 'Anónimo' })
      setBuyer('')
      setQty(initialQty)
    }catch(err){
      console.error(err)
      add(err.message || 'Error al guardar')
    }finally{ setLoading(false) }
  }

  return (
    <form className="purchase-form" onSubmit={submit} style={{marginTop:8}}>
      <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
        <input className="small" type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} style={{width:110,padding:'0.55rem',borderRadius:8}}/>
        <input placeholder="Nombre comprador (opcional)" value={buyer} onChange={e=>setBuyer(e.target.value)} style={{flex:1,padding:'0.55rem',borderRadius:8}} />
        <button className="btn" type="submit" disabled={loading}>Registrar · ₡{(price * (Number(qty)||0)).toFixed(2)}</button>
      </div>
    </form>
  )
}
