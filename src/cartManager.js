import { existsSync, promises } from "fs";
import { manager } from "./prodManager.js";


/* por parámetro al constructor le paso la ruta del archivo a utilizar */
class CartManager {
    constructor(path) {
        this.path = path
    }

    

    async createCart() {
        try {
            let cartFile = []
            let id;

            if (existsSync(this.path)){                
                const file= await promises.readFile(this.path, 'utf-8')
                cartFile = JSON.parse(file)
                if (!cartFile.length){
                    id = 1
                }else{
                    id = cartFile[cartFile.length-1].id + 1
                }              
                
            }else{                             
                id = 1             
            }
            const newCart = {id, 
                products: []
            }

            /* pusheo el nuevo producto al array cartFile */
            cartFile.push(newCart)

            /* hago un segundo await para sobreescribir el archivo */
            await promises.writeFile(this.path, JSON.stringify(cartFile))
            return newCart
        }
        catch(error){
            return(error)
        }        
    }


    async getCartProducts(cid) {
        try{
            if (existsSync(this.path)){
                const cartProductsFile= await promises.readFile(this.path, 'utf-8')
                
                const cartProductsParseado= JSON.parse(cartProductsFile)
                const selectedCart = cartProductsParseado.find(c=> c.id === cid)
                return selectedCart               
            }else{
                throw new Error ("the file does not exist")
            }
        }
        catch(error){
            throw new Error(error.message);
        }
                    
    }



    async addProductToCart(cid, pid){
        try{
            if (existsSync(this.path)){
                const cartProductsFile= await promises.readFile(this.path, 'utf-8')
                
                const cartProductsParseado= JSON.parse(cartProductsFile)
                const selectedCart = cartProductsParseado.find(c=> c.id === cid)
    
                if (selectedCart){
                    const product = await manager.getProductById(pid);
                    if (!product) {
                      throw new Error("There is no product with this id");
                    }
    
                    const prodExists = selectedCart.products.find(p=>p.pid === pid)
                    if (prodExists) {
                        const index = selectedCart.products.findIndex(p=> p.pid == pid)
                        selectedCart.products[index].quantity += 1                    
                    }else{
                        const newProd ={
                            pid, 
                            quantity: 1
                        }
                        selectedCart.products.push(newProd)
                    }
                    
                    await promises.writeFile(this.path, JSON.stringify(cartProductsParseado))
                }            
                return selectedCart            
            }else{
                throw new Error("The file does not exist");
            }
        }
        catch(error){
            throw new Error(error.message);
        }  
        }    
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//TESTING



async function test() {
    const cManager = new CartManager("./data/mycart.json")
    
    
    /* CREATE CART */
    await cManager.createCart()
    //await cManager.addProductToCart(2, 4)
    
}
   


//test()

export const cManager = new CartManager("./data/mycart.json");