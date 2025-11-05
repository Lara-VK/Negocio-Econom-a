import { registerUser, setCurrentUser } from './auth'
import { saveProduct, updateProduct } from './api'

export async function seedDemo(){
  // register two users
  try{
    const emprendedor = registerUser({ name: 'ana', role: 'emprendedor', password: '1234' })
    const cliente = registerUser({ name: 'carlos', role: 'cliente', password: '1234' })

    // create demo products
    const p1 = await saveProduct({ title: 'Pulsera artesanal', price: '1500', description: 'Pulsera hecha a mano', image: '', variableCost: '500', meta: '2000', ownerId: emprendedor.id, ownerName: emprendedor.name })
    const p2 = await saveProduct({ title: 'Cuaderno eco', price: '1200', description: 'Cuaderno reciclado', image: '', variableCost: '400', meta: '1500', ownerId: emprendedor.id, ownerName: emprendedor.name })

    // simulate some sales
    await updateProduct(p1.id, { sales: 3 })
    await updateProduct(p2.id, { sales: 5 })

    // ensure no current user is set (let user login)
    setCurrentUser(null)
    return { emprendedor, cliente }
  }catch(e){
    console.error('Seed error', e)
    throw e
  }
}
