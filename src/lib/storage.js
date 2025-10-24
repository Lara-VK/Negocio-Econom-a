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
