// Api shim: intenta llamar a un backend, si no responde usa localStorage (storage.js)
import axios from 'axios'
import * as storage from './storage'
import { getCurrentUser } from './auth'

const BASE = '' // cuando haya backend, setear url base, ej: 'http://localhost:8000'

async function tryBackend(path, method='get', data){
  if(!BASE) throw new Error('No backend')
  const url = `${BASE}${path}`
  const res = await axios({ url, method, data })
  return res.data
}

export async function fetchProducts(){
  try{ return await tryBackend('/api/products') }catch(e){ return storage.getProducts() }
}

export async function saveProduct(product){
  try{ return await tryBackend('/api/products','post',product) }catch(e){ return storage.saveProduct(product) }
}

export async function updateProduct(id, patch){
  try{ return await tryBackend(`/api/products/${id}`,'put',patch) }catch(e){ return storage.updateProduct(id, patch) }
}

export async function deleteProduct(id){
  try{ return await tryBackend(`/api/products/${id}`,'delete') }catch(e){ return storage.deleteProduct(id) }
}

// costs stored per entrepreneur id
function costsKey(ownerId){ return `pe_costs_${ownerId}` }
export function setCostsForOwner(ownerId, costs){
  try{ localStorage.setItem(costsKey(ownerId), JSON.stringify(costs)); return costs }catch(e){return null}
}
export function getCostsForOwner(ownerId){
  try{ const r = localStorage.getItem(costsKey(ownerId)); return r? JSON.parse(r): { fixed:0, variable:0 } }catch(e){ return {fixed:0,variable:0} }
}

// record a sale: increments sales count on product and persists
export async function recordSale(productId, qty=1){
  try{
    if(BASE) return await tryBackend(`/api/products/${productId}/sale`,'post',{qty})
  }catch(e){ /* fallback */ }
  // local fallback
  const products = storage.getProducts()
  const idx = products.findIndex(p=>p.id===productId)
  if(idx===-1) throw new Error('Producto no encontrado')
  products[idx].sales = (products[idx].sales||0) + qty
  storage.updateProduct(products[idx].id, { sales: products[idx].sales })
  return products[idx]
}

// analytics for an entrepreneur
export function analyticsForOwner(ownerId){
  const all = storage.getProducts().filter(p=>p.ownerId===ownerId)
  // Now per-product meta is used. No global owner costs are required.
  const totalSales = all.reduce((s,p)=>s + (p.sales||0),0)
  const totalRevenue = all.reduce((s,p)=>s + ((p.sales||0) * (Number(p.price) || 0)), 0)
  const totalVariable = all.reduce((s,p)=> s + ((p.sales||0) * (Number(p.variableCost) || 0)), 0)
  const totalProfit = all.reduce((s,p)=> s + ((p.sales||0) * (((Number(p.price) || 0) - (Number(p.variableCost) || 0)))), 0)
  const perProduct = all.map(p=>{
    const sales = p.sales||0
    const price = Number(p.price) || 0
    const varc = Number(p.variableCost) || 0
    const profitAchieved = sales * (price - varc)
    return {
      id: p.id,
      title: p.title,
      sales,
      revenue: sales * price,
      profitAchieved,
      price,
      variableCost: varc,
      meta: p.meta ? Number(p.meta) : 0
    }
  })
  return { totalSales, totalRevenue, totalVariable, totalProfit, perProduct }
}

export default {
  fetchProducts, saveProduct, updateProduct, deleteProduct, recordSale, setCostsForOwner, getCostsForOwner, analyticsForOwner
}
