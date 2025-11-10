import React, { createContext, useContext, useState } from 'react'

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }){
  const [state, setState] = useState(null)

  function confirm(message, opts = {}){
    return new Promise(resolve => {
      setState({ message, opts, resolve })
    })
  }

  function close(result){
    if(state && typeof state.resolve === 'function') state.resolve(result)
    setState(null)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(2,6,23,0.4)',zIndex:9999}}>
          <div style={{width:420,maxWidth:'94%',background:'var(--surface)',padding:20,borderRadius:12,boxShadow:'0 18px 40px rgba(11,18,32,0.18)'}}>
            <div style={{marginBottom:16,fontSize:16,color:'var(--accent)'}}>{state.message}</div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
              <button className="btn secondary" onClick={()=>close(false)}>{state.opts.cancelText||'Cancelar'}</button>
              <button className="btn" onClick={()=>close(true)}>{state.opts.okText||'Aceptar'}</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm(){
  const ctx = useContext(ConfirmContext)
  if(!ctx) throw new Error('useConfirm must be used inside ConfirmProvider')
  return ctx.confirm
}

export default { ConfirmProvider, useConfirm }
