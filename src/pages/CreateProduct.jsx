import React from 'react'
import ProductForm from '../components/ProductForm'
import { saveProduct } from '../lib/storage'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'
import { useToast } from '../lib/toast.jsx'

export default function CreateProduct() {
  const navigate = useNavigate()

  function handleSave(product) {
    const user = getCurrentUser()
    if(!user) return alert('Debes iniciar sesión como emprendedor para publicar')
    if(user.role !== 'emprendedor') return alert('Solo los emprendedores pueden publicar productos')
    const created = saveProduct({ ...product, ownerId: user.id, ownerName: user.name })
    add('Producto publicado')
    // navigate to listings after save
    navigate('/listings')
  }

  const { add } = useToast()

  return (
    <section>
      <h2>Publicar producto</h2>
      <ProductForm onSave={handleSave} />
    </section>
  )
}
