import React from 'react'
import { useToast } from '../lib/toast.jsx'

export default function Toasts(){
  const { toasts, remove } = useToast()

  return (
    <div style={{position:'fixed',right:16,top:16,display:'flex',flexDirection:'column',gap:8,zIndex:9999}}>
      {toasts.map(t => (
        <div key={t.id} style={{background:'white',padding:'10px 14px',borderRadius:8,boxShadow:'0 6px 18px rgba(2,6,23,0.12)',minWidth:220}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
            <div style={{fontSize:14,color:'#0f172a'}}>{t.message}</div>
            <button onClick={()=>remove(t.id)} style={{background:'transparent',border:'none',cursor:'pointer',color:'#6b7280'}}>×</button>
          </div>
        </div>
      ))}
    </div>
  )
}
