const USERS_KEY = 'pe_users_v1'
const CURRENT_KEY = 'pe_current_user'

function readUsers(){
  try{
    const raw = localStorage.getItem(USERS_KEY)
    return raw? JSON.parse(raw): []
  }catch(e){console.error(e);return[]}
}

function writeUsers(list){
  localStorage.setItem(USERS_KEY, JSON.stringify(list))
}

// Nota: para el prototipo almacenamos una versión codificada de la contraseña con btoa.
// No usar en producción. Reemplazar por hashing seguro y backend.
export function registerUser({name, role, password, contact = '', avatar = ''}){
  const users = readUsers()
  const exists = users.find(u => u.name === name)
  if(exists) throw new Error('El nombre de usuario ya existe')
  const user = { id: Date.now().toString(), name, role, pwd: password? btoa(password): '', contact, avatar }
  users.push(user)
  writeUsers(users)
  // include contact and avatar in current user snapshot
  setCurrentUser({ id: user.id, name: user.name, role: user.role, contact: user.contact, avatar: user.avatar })
  return user
}

export function loginUser(name, password){
  const users = readUsers()
  const found = users.find(u => u.name === name)
  if(!found) throw new Error('Usuario no encontrado')
  if(found.pwd && (!password || btoa(password) !== found.pwd)) throw new Error('Contraseña incorrecta')
  setCurrentUser({ id: found.id, name: found.name, role: found.role, contact: found.contact || '', avatar: found.avatar || '' })
  return found
}

export function getCurrentUser(){
  try{
    const raw = localStorage.getItem(CURRENT_KEY)
    return raw? JSON.parse(raw): null
  }catch(e){return null}
}

export function setCurrentUser(user){
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user))
  try{ window.dispatchEvent(new Event('pe_user_change')) }catch(e){}
}

export function logout(){
  localStorage.removeItem(CURRENT_KEY)
  try{ window.dispatchEvent(new Event('pe_user_change')) }catch(e){}
}

export function listUsers(){
  return readUsers()
}
const products = JSON.parse(localStorage.getItem('pe_products_v1') || '[]');
console.table(products);
// Eliminar usuarios por nombre (dev helper). Devuelve array con nombres eliminados.
export function removeUsersByNames(names){
  if(!Array.isArray(names)) names = [names]
  const users = readUsers()
  const lower = names.map(n=>String(n).toLowerCase())
  const kept = users.filter(u => !lower.includes(String(u.name).toLowerCase()))
  const removed = users.filter(u => lower.includes(String(u.name).toLowerCase())).map(u=>u.name)
  writeUsers(kept)
  try{
    const curRaw = localStorage.getItem(CURRENT_KEY)
    if(curRaw){
      const cur = JSON.parse(curRaw)
      if(cur && lower.includes(String(cur.name).toLowerCase())){
        localStorage.removeItem(CURRENT_KEY)
      }
    }
  }catch(e){}
  return removed
}

export function getUserById(id){
  const users = readUsers()
  return users.find(u=>u.id===id) || null
}

export function updateUser(id, patch){
  const users = readUsers()
  const idx = users.findIndex(u=>u.id===id)
  if(idx===-1) return null
  users[idx] = {...users[idx], ...patch}
  writeUsers(users)
  // if updating current user, refresh current snapshot
  try{
    const cur = getCurrentUser()
    if(cur && cur.id === id){
      setCurrentUser({ id: users[idx].id, name: users[idx].name, role: users[idx].role, contact: users[idx].contact || '', avatar: users[idx].avatar || '' })
    }
  }catch(e){}
  return users[idx]
}
