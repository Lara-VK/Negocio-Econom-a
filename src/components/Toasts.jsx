import React from 'react'
import { useToast } from '../lib/toast.jsx'

export default function Toasts(){
  const { toasts, remove } = useToast()

  return (
    <div className="toast-wrapper">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
            <div style={{fontSize:14,color:'var(--accent)'}}>{t.message}</div>
            <button className="close" onClick={()=>remove(t.id)}>×</button>
          </div>
        </div>
      ))}
    </div>
  )
}
