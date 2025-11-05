import React, { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/auth'
import { getCostsForOwner, setCostsForOwner } from '../lib/api'
import { useToast } from '../lib/toast.jsx'

export default function CostsForm(){
  const user = getCurrentUser()
  const { add } = useToast()
  const [fixed, setFixed] = useState('')
  const [variable, setVariable] = useState('')

  useEffect(()=>{
    if(!user) return
    const c = getCostsForOwner(user.id)
    setFixed(c.fixed || 0)
    setVariable(c.variable || 0)
  },[])

  function handle(e){
    e.preventDefault()
    if(!user) return alert('Debes iniciar sesión')
    setCostsForOwner(user.id, { fixed: Number(fixed||0), variable: Number(variable||0) })
    add('Costos guardados')
  }

  if(!user) return <p>Inicia sesión para administrar tus costos</p>

  return (
    <section>
      <h2>Costos del emprendimiento</h2>
      <form onSubmit={handle} className="product-form">
        <label>Costos fijos totales (mensuales)
          <input value={fixed} onChange={e=>setFixed(e.target.value)} />
        </label>

        <label>Costo variable por unidad (valor por defecto)
          <input value={variable} onChange={e=>setVariable(e.target.value)} />
        </label>

        <div style={{marginTop:8}}>
          <button className="btn" type="submit">Guardar costos</button>
        </div>
      </form>
    </section>
  )
}
