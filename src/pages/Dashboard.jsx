import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '../lib/auth'
import { analyticsForOwner } from '../lib/api'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard(){
  const user = getCurrentUser()
  const [data, setData] = useState(null)

  useEffect(()=>{
    if(!user) return
    const a = analyticsForOwner(user.id)
    setData(a)
  },[user])

  if(!user) return <p>Acceso restringido. Inicia sesión como emprendedor.</p>
  if(!data) return <p>Cargando...</p>

  const labels = data.perProduct.map(p=>p.title)
  const sales = data.perProduct.map(p=>p.sales)
  const revenue = data.perProduct.map(p=>p.revenue)
  const progress = data.perProduct.map(p => p.meta ? Math.min(100, (p.profitAchieved / p.meta) * 100) : 0)

  const chartData = {
    labels,
    datasets: [
      { label: 'Ventas (unidades)', data: sales, backgroundColor: '#06b6d4' },
      { label: 'Ingresos (₡)', data: revenue, backgroundColor: '#0ea5a4' }
    ]
  }

  return (
    <section>
      <h2>Panel de control — Estadísticas</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginTop:12}}>
        <div className="card">
          <h3>Total ventas</h3>
          <div style={{fontSize:20,fontWeight:700}}>{data.totalSales}</div>
        </div>
        <div className="card">
          <h3>Ingresos totales</h3>
          <div style={{fontSize:20,fontWeight:700}}>₡ {data.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="card">
          <h3>Costos variables</h3>
          <div style={{fontSize:20,fontWeight:700}}>₡ {data.totalVariable.toFixed(2)}</div>
        </div>
        <div className="card">
          <h3>Utilidad neta</h3>
          <div style={{fontSize:20,fontWeight:700}}>₡ {data.totalProfit.toFixed(2)}</div>
        </div>
      </div>

      <div style={{marginTop:18}}>
        <h3>Ventas por producto</h3>
        <Bar data={chartData} />
      </div>

      <div style={{marginTop:18}}>
        <h3>Progreso hacia la meta por producto</h3>
        <div className="card-grid" style={{marginTop:8}}>
          {data.perProduct.map(p => (
            <div key={p.id} className="card">
              <h4>{p.title}</h4>
              <p>Ventas: {p.sales} unidades</p>
              <p>Utilidad acumulada: ₡ {p.profitAchieved.toFixed(2)}</p>
              <p>Meta: ₡ { (p.meta ? Number(p.meta) : 0).toFixed(2) }</p>
              <p>Progreso: {p.meta ? Math.min(100, (p.profitAchieved / Number(p.meta)) * 100).toFixed(1) : '—'}%</p>
              {p.meta && (() => {
                const profitPerUnit = (Number(p.price) || 0) - (Number(p.variableCost) || 0)
                const remaining = Math.max(0, Number(p.meta) - p.profitAchieved)
                const unitsNeeded = profitPerUnit > 0 ? Math.ceil(remaining / profitPerUnit) : null
                return (
                  <p>{unitsNeeded !== null ? `Unidades faltantes para alcanzar meta: ${unitsNeeded}` : 'Meta no alcanzable con el precio/costo actual'}</p>
                )
              })()}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
