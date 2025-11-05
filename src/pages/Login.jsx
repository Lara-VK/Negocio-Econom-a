import React, { useState } from 'react'
import { loginUser, listUsers } from '../lib/auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../lib/toast.jsx'

export default function Login(){
  const [name, setName] = useState('')
  const [pwd, setPwd] = useState('')
  const navigate = useNavigate()
  const users = listUsers()
  const { add } = useToast()

  function handle(e){
    e.preventDefault()
    try{
      loginUser(name.trim(), pwd)
      add(`${name} inició sesión`)
      navigate('/listings')
    }catch(err){
      alert(err.message)
    }
  }

  return (
    <section>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handle} className="product-form">
        <label>Nombre
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </label>

        <label>Contraseña
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} required />
        </label>

        <div style={{marginTop:8}}>
          <button className="btn" type="submit">Entrar</button>
        </div>

        {users.length>0 && (
          <div style={{marginTop:12}}>
            <p style={{color:'#6b7280'}}>Usuarios existentes (click para autocompletar)</p>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {users.map(u=> (
                <button key={u.id} type="button" className="btn secondary" onClick={()=>setName(u.name)}>{u.name} ({u.role})</button>
              ))}
            </div>
          </div>
        )}
      </form>
    </section>
  )
}
