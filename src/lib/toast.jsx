import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, opts = {}) => {
    const id = Date.now().toString()
    const t = { id, message, ...opts }
    setToasts(s => [t, ...s])
    if(opts.duration !== 0){
      setTimeout(()=> setToasts(s => s.filter(x=>x.id!==id)), opts.duration || 3500)
    }
    return id
  }, [])

  const remove = useCallback((id) => setToasts(s => s.filter(x=>x.id!==id)), [])

  return (
    <ToastContext.Provider value={{ toasts, add, remove }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastContext)
  if(!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
