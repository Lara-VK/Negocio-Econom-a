import React, { useState, useRef } from 'react'
import { useToast } from '../lib/toast.jsx'

export default function ProductForm({ onSave, initial }) {
  const { add } = useToast()
  const [title, setTitle] = useState(initial?.title || '')
  const [price, setPrice] = useState(initial?.price || '')
  const [description, setDescription] = useState(initial?.description || '')
  // image will hold a data URL (base64) or an existing URL
  const [image, setImage] = useState(initial?.image || '')
  const [meta, setMeta] = useState(initial?.meta || '')
  const [variableCost, setVariableCost] = useState(initial?.variableCost || '')
  // contact removed: use owner's profile contact instead
  const inputFileRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()){ add('El título es requerido'); return }
    const product = {
      title: title.trim(),
      price: price.trim(),
      description: description.trim(),
      image: image || '',
      meta: meta.trim(),
      variableCost: variableCost.trim(),
      // contact removed; owner contact is taken from user profile
    }
    try{
      onSave(product)
    }catch(e){
      console.error('Error en onSave', e)
      add('Error al guardar producto: '+(e.message||e))
    }
  }

  function handleFileChange(e){
    const f = e.target.files && e.target.files[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = () => {
      setImage(String(reader.result))
    }
    reader.readAsDataURL(f)
  }

  function removeImage(){
    setImage('')
    if(inputFileRef.current) inputFileRef.current.value = null
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
        Imagen (subir desde tu dispositivo)
        <input ref={inputFileRef} type="file" accept="image/*" onChange={handleFileChange} />
        {image && (
          <div style={{marginTop:8,display:'flex',gap:8,alignItems:'center'}}>
            <img src={image} alt="preview" style={{width:120,height:80,objectFit:'cover',borderRadius:8,border:'1px solid rgba(0,0,0,0.06)'}} />
            <div>
              <button type="button" className="btn secondary" onClick={()=> inputFileRef.current && inputFileRef.current.click()}>Cambiar</button>
              <button type="button" className="btn danger" onClick={removeImage} style={{marginLeft:8}}>Eliminar</button>
            </div>
          </div>
        )}
      </label>
      
      {/* contacto eliminado del formulario: se usará el contacto del perfil del emprendedor */}

      <div style={{marginTop:8}}>
        <button type="submit" className="btn">{initial ? 'Guardar cambios' : 'Publicar'}</button>
      </div>
    </form>
  )
}
