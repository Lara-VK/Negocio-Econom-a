import React from 'react'
import ProductForm from '../components/ProductForm'
import { saveProduct } from '../lib/storage'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'
import { useToast } from '../lib/toast.jsx'

export default function CreateProduct() {
  const navigate = useNavigate()
  const { add } = useToast()

  function handleSave(product) {
    const user = getCurrentUser()
    if(!user){ add('Debes iniciar sesión como emprendedor para publicar'); return }
    if(user.role !== 'emprendedor'){ add('Solo los emprendedores pueden publicar productos'); return }
    const created = saveProduct({ ...product, ownerId: user.id, ownerName: user.name, ownerContact: product.contact || '' })
    add('Producto publicado')
    // navigate to listings after save
    navigate('/listings')
  }

  return (
    <section>
      <h2>Publicar producto</h2>
      <ProductForm onSave={handleSave} />
    </section>
  )
}
