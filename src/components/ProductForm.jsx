import React, { useState } from 'react'
import { useToast } from '../lib/toast.jsx'

export default function ProductForm({ onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [price, setPrice] = useState(initial?.price || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [image, setImage] = useState(initial?.image || '')
  const [meta, setMeta] = useState(initial?.meta || '')
  const [variableCost, setVariableCost] = useState(initial?.variableCost || '')
  const [contact, setContact] = useState(initial?.contact || '')

  function handleSubmit(e) {
    e.preventDefault()
    const { add } = useToast()
    if (!title.trim()){ add('El título es requerido'); return }
    const product = {
      title: title.trim(),
      price: price.trim(),
      description: description.trim(),
      image: image.trim(),
      meta: meta.trim(),
      variableCost: variableCost.trim(),
      contact: contact.trim()
    }
    onSave(product)
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <label>
        Título
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </label>

      <label>
        Precio (opcional)
        <input value={price} onChange={e => setPrice(e.target.value)} />
      </label>

      <label>
        Costo variable por unidad (opcional)
        <input value={variableCost} onChange={e => setVariableCost(e.target.value)} />
      </label>

      <label>
        Meta de utilidad total deseada para este producto (₡)
        <input value={meta} onChange={e => setMeta(e.target.value)} />
      </label>

      <label>
        Descripción
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>

      <label>
        URL imagen (opcional)
        <input value={image} onChange={e => setImage(e.target.value)} />
      </label>
      
      <label>
        Medio de contacto (teléfono, email o enlace)
        <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Ej. whatsapp: 555-1234 o correo@example.com" />
      </label>

      <div style={{marginTop:8}}>
        <button type="submit">Publicar</button>
      </div>
    </form>
  )
}
