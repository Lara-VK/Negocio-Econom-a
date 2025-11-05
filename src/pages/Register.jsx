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

  function handle(e){
    e.preventDefault()
    try{
      registerUser({name: name.trim(), role, password: pwd})
      add(`${name} registrado (${role})`)
      navigate('/listings')
    }catch(err){
      alert(err.message)
    }
  }

  return (
    <section>
      <h2>Registro</h2>
      <form onSubmit={handle} className="product-form">
        <label>Nombre
          <input value={name} onChange={e=>setName(e.target.value)} required />
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
