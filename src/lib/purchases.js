const KEY = 'pe_purchases_v1'

function read(){
  try { const raw = localStorage.getItem(KEY); return raw? JSON.parse(raw): [] } catch(e){ console.error(e); return [] }
}

function write(list){
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function getPurchases(){
  return read()
}

export function getPurchasesForOwner(ownerId){
  const all = read()
  return all.filter(p => p.ownerId === ownerId)
}

// purchase: { productId, ownerId, title, qty, buyer }
export function savePurchase(purchase){
  const items = read()
  const withId = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...purchase }
  items.unshift(withId)
  write(items)
  return withId
}

export function clearPurchases(){ localStorage.removeItem(KEY) }

export default { getPurchases, getPurchasesForOwner, savePurchase, clearPurchases }
