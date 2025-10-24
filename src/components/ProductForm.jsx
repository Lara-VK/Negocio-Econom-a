import React, { useState } from 'react'

export default function ProductForm({ onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [price, setPrice] = useState(initial?.price || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [image, setImage] = useState(initial?.image || '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return alert('El título es requerido')
    const product = { title: title.trim(), price: price.trim(), description: description.trim(), image: image.trim() }
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
        Descripción
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>

      <label>
        URL imagen (opcional)
        <input value={image} onChange={e => setImage(e.target.value)} />
      </label>

      <div style={{marginTop:8}}>
        <button type="submit">Publicar</button>
      </div>
    </form>
  )
}
