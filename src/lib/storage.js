const KEY = 'pe_products_v1'

function read(){
  try { const raw = localStorage.getItem(KEY); return raw? JSON.parse(raw): [] } catch(e){ console.error(e); return [] }
}

function write(list){
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function getProducts() {
  return read()
}

// Eliminar productos por título (case-insensitive). Dev helper.
export function removeProductsByTitle(titles){
  if(!Array.isArray(titles)) titles = [titles]
  const lower = titles.map(t=>String(t).toLowerCase())
  const items = read()
  const kept = items.filter(p => !lower.includes(String(p.title||'').toLowerCase()))
  const removed = items.filter(p => lower.includes(String(p.title||'').toLowerCase())).map(p=>p.title)
  write(kept)
  return removed
}

export function saveProduct(product){
  const items = read()
  const withId = { id: Date.now().toString(), ...product }
  items.unshift(withId)
  write(items)
  return withId
}

export function updateProduct(id, patch){
  const items = read()
  const idx = items.findIndex(x=>x.id===id)
  if(idx===-1) return null
  items[idx] = {...items[idx], ...patch}
  write(items)
  return items[idx]
}

export function deleteProduct(id){
  const items = read()
  const kept = items.filter(x=>x.id!==id)
  write(kept)
  return kept
}

export function clearProducts() { localStorage.removeItem(KEY) }
