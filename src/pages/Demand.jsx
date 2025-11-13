import React, { useEffect, useState } from 'react'
import { fetchProducts, recordSale, analyticsForOwner } from '../lib/api'
import { getCurrentUser } from '../lib/auth'
import * as purchases from '../lib/purchases'
import { useToast } from '../lib/toast.jsx'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Demand(){
  const [products, setProducts] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const me = getCurrentUser()
  const toast = useToast()

  useEffect(()=>{
    let mounted = true
    async function load(){
      setLoading(true)
      const all = await fetchProducts()
      if(!mounted) return
      // show only products of current entrepreneur (if logged)
      const mine = me ? all.filter(p=>p.ownerId === me.id) : []
      setProducts(mine)
      setRecords(purchases.getPurchasesForOwner(me?.id))
      // analytics
      if(me){
        try{
          const an = analyticsForOwner(me.id)
          setChartData({ labels: an.perProduct.map(x=>x.title), values: an.perProduct.map(x=>x.sales) })
        }catch(e){ /* ignore */ }
      }
      setLoading(false)
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  const [chartData, setChartData] = useState({ labels: [], values: [] })

  async function handleSave({ productId, qty, buyer }){
    const prod = products.find(p=>p.id===productId)
    if(!prod) throw new Error('Producto no encontrado')
    // record sale (increments sales count)
    await recordSale(productId, qty)
    // persist a purchase record
    const rec = purchases.savePurchase({ productId, ownerId: prod.ownerId, title: prod.title, qty, buyer, price: prod.price })
    // refresh local state
    setRecords(r => [rec, ...r])
    // update product in list (sales count may have changed in storage)
    const updated = { ...prod, sales: (prod.sales||0) + qty }
    setProducts(ps => ps.map(p => p.id===productId ? updated : p))
    toast.add('Compra registrada', { duration: 3000 })
  }

  if(loading) return <div>Cargando...</div>

  return (
    <div>
      <h2>Demanda · Registro de compras</h2>
      {chartData.labels.length>0 && (
        <div style={{marginBottom:18}}>
          <h4>Ventas por producto</h4>
          <Bar data={{ labels: chartData.labels, datasets: [{ label: 'Unidades vendidas', backgroundColor: 'rgba(15,118,110,0.9)', data: chartData.values }] }} options={{ responsive:true, plugins:{legend:{display:false}} }} />
        </div>
      )}
      { !me && <p>Inicia sesión para ver y registrar compras de tus productos.</p> }

      { products.length === 0 && me && (
        <p>No tienes productos publicados todavía.</p>
      ) }

      <h3 style={{marginTop:28,marginBottom:16}}>Registros recientes de compras</h3>
      { records.length === 0 && (
        <div style={{padding:20,background:'linear-gradient(90deg,rgba(15,118,110,0.04),rgba(6,182,212,0.02))',borderRadius:10,textAlign:'center',color:'#6b7280'}}>No hay registros de compras aún.</div>
      ) }
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:12}}>
        {records.map(r=> (
          <div key={r.id} style={{background:'var(--surface)',padding:16,borderRadius:10,boxShadow:'0 6px 18px rgba(12,18,28,0.06)',borderLeft:'4px solid var(--primary)',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <div>
              <h4 style={{margin:'0 0 8px 0',color:'var(--accent)'}}>{r.title}</h4>
              <div style={{fontSize:14,color:'var(--muted)',lineHeight:1.6}}>
                <div><strong>Cantidad:</strong> {r.qty} unidad(es)</div>
                <div><strong>Comprador:</strong> {r.buyer}</div>
                <div><strong>Precio total:</strong> ₡{(r.price * r.qty).toLocaleString('es-CR')}</div>
              </div>
            </div>
            <div style={{fontSize:12,color:'#9ca3af',marginTop:10,paddingTop:10,borderTop:'1px solid rgba(2,6,23,0.04)'}}>
              {new Date(r.createdAt).toLocaleDateString('es-CR')} · {new Date(r.createdAt).toLocaleTimeString('es-CR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
