import React, { useEffect, useState } from 'react'
import ProductForm from '../components/ProductForm'
import { getProducts, updateProduct } from '../lib/storage'
import { useNavigate, useParams } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'
import { useToast } from '../lib/toast.jsx'

export default function EditProduct(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [initial, setInitial] = useState(null)
  const { add } = useToast()

  useEffect(()=>{
    const all = getProducts()
    const found = all.find(x=>x.id===id)
    if(!found) return navigate('/listings')
    const user = getCurrentUser()
    if(!user || user.role!=='emprendedor' || user.id !== found.ownerId){
      add('No autorizado')
      return navigate('/listings')
    }
    setInitial(found)
  },[id])

  function handleSave(patch){
    updateProduct(id, patch)
    add('Producto actualizado')
    navigate('/listings')
  }

  if(!initial) return <p>Cargando...</p>

  return (
    <section>
      <h2>Editar producto</h2>
      <ProductForm onSave={handleSave} initial={initial} />
    </section>
  )
}


