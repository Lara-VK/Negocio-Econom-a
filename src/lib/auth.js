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
export function registerUser({name, role, password}){
  const users = readUsers()
  const exists = users.find(u => u.name === name)
  if(exists) throw new Error('El nombre de usuario ya existe')
  const user = { id: Date.now().toString(), name, role, pwd: password? btoa(password): '' }
  users.push(user)
  writeUsers(users)
  setCurrentUser({ id: user.id, name: user.name, role: user.role })
  return user
}

export function loginUser(name, password){
  const users = readUsers()
  const found = users.find(u => u.name === name)
  if(!found) throw new Error('Usuario no encontrado')
  if(found.pwd && (!password || btoa(password) !== found.pwd)) throw new Error('Contraseña incorrecta')
  setCurrentUser({ id: found.id, name: found.name, role: found.role })
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
}

export function logout(){
  localStorage.removeItem(CURRENT_KEY)
}

export function listUsers(){
  return readUsers()
}
