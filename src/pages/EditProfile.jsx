import React, { useEffect, useState, useRef } from 'react'
import { getCurrentUser, updateUser, getUserById } from '../lib/auth'
import { useToast } from '../lib/toast.jsx'
import { useNavigate } from 'react-router-dom'

export default function EditProfile(){
  const cur = getCurrentUser()
  const [initial, setInitial] = useState(cur)
  const [name, setName] = useState(initial?.name || '')
  const [contact, setContact] = useState(initial?.contact || '')
  const [avatar, setAvatar] = useState(initial?.avatar || '')
  const { add } = useToast()
  const navigate = useNavigate()
  const fileRef = useRef()

  useEffect(()=>{
    if(initial && initial.id){
      const full = getUserById(initial.id)
      if(full){ setName(full.name); setContact(full.contact||''); setAvatar(full.avatar||'') }
    }
  },[initial])

  function handleFile(e){
    const f = e.target.files && e.target.files[0]
    if(!f) return
    const r = new FileReader()
    r.onload = ()=> setAvatar(String(r.result))
    r.readAsDataURL(f)
  }

  function save(e){
    e.preventDefault()
    if(!initial) return
    const updated = updateUser(initial.id, { name: name.trim(), contact: contact.trim(), avatar: avatar || '' })
    add('Perfil actualizado')
    navigate('/')
  }

  if(!initial) return <p>No hay usuario conectado</p>

  return (
    <section>
      <h2>Editar perfil</h2>
      <form onSubmit={save} className="product-form">
        <label>Nombre
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </label>

        <label>Medio de contacto
          <input value={contact} onChange={e=>setContact(e.target.value)} />
        </label>

        <label>Foto de perfil
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
          {avatar && <img src={avatar} alt="avatar" style={{width:72,height:72,borderRadius:999,display:'block',marginTop:8}} />}
        </label>

        <div style={{marginTop:8}}>
          <button className="btn" type="submit">Guardar</button>
        </div>
      </form>
    </section>
  )
}
