import React, { useEffect, useState } from 'react'
import { fetchProducts, recordSale, analyticsForOwner } from '../lib/api'
import { getCurrentUser } from '../lib/auth'
import * as purchases from '../lib/purchases'
import PurchaseForm from '../components/PurchaseForm'
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

      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
        {products.map(p=> (
          <div key={p.id} className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <strong>{p.title}</strong>
                <div style={{fontSize:13,color:'#666'}}>Precio: ₡{p.price} · Vendidos: {p.sales||0}</div>
              </div>
            </div>
            <PurchaseForm product={p} onSave={handleSave} />
          </div>
        ))}
      </div>

      <h3 style={{marginTop:20}}>Registros recientes</h3>
      { records.length === 0 && <div>No hay registros de compras aún.</div> }
      <ul>
        {records.map(r=> (
          <li key={r.id} style={{marginBottom:8}}>
            <strong>{r.title}</strong> — {r.qty} unidad(es) • comprador: {r.buyer} • {new Date(r.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
