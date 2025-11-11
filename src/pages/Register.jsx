import React, { useState } from 'react'
import { registerUser } from '../lib/auth'
import { useToast } from '../lib/toast.jsx'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name, setName] = useState('')
  const [role, setRole] = useState('cliente')
  const navigate = useNavigate()
  const [pwd, setPwd] = useState('')
  const { add } = useToast()
  const [contact, setContact] = useState('')
  const [avatar, setAvatar] = useState('')
  const fileRef = React.createRef()

  function handleFile(e){
    const f = e.target.files && e.target.files[0]
    if(!f) return
    const r = new FileReader()
    r.onload = ()=> setAvatar(String(r.result))
    r.readAsDataURL(f)
  }

  function handle(e){
    e.preventDefault()
    try{
      registerUser({name: name.trim(), role, password: pwd, contact: contact.trim(), avatar: avatar || ''})
      add(`${name} registrado (${role})`)
      navigate('/listings')
    }catch(err){
      add(err.message)
    }
  }

  return (
    <section>
      <h2>Registro</h2>
      <form onSubmit={handle} className="product-form">
        <label>Nombre
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </label>

        <label>Medio de contacto (teléfono/email)
          <input value={contact} onChange={e=>setContact(e.target.value)} />
        </label>

        <label>Foto de perfil (opcional)
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
          {avatar && <img src={avatar} alt="avatar" style={{width:56,height:56,objectFit:'cover',borderRadius:999,display:'block',marginTop:8}} />}
        </label>

        <label>Contraseña
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} required />
        </label>

        <label>Registrarse como
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="emprendedor">Emprendedor</option>
          </select>
        </label>

        <div style={{marginTop:8}}>
          <button className="btn" type="submit">Crear cuenta</button>
        </div>
  </form>
    </section>
  )
}
