import { existsSync, promises } from "fs";


/* por parámetro al constructor le paso la ruta del archivo a utilizar */
class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {        
        
        try {
            /* pregunto si existe el archivo
            si existe lo leo y lo guardo en una variable, y retorno esa variable parseada a objeto JS
            si no existe, retorno un array vacio */
            if (existsSync(this.path)){
                const productsFile= await promises.readFile(this.path, 'utf-8')
                /* return JSON.parse(productsFile) */
                const productsParseado= JSON.parse(productsFile)
               /* retorno todo el array de prod */
                return productsParseado
            }else {
                //console.log([])
                return []
            }
        }
        catch (error) {
            return error
        }
    }



    async addProduct(product) {
        try {
            /* paso un status con valor true por defecto */
            /* hago un await para esperar la respuesta del getProducts con el que traigo la info del archivo */
            const products = await this.getProducts()
            const {title, description, price, code, stock, category} = product
            if (!title || !description || !price || !stock || !code || !category) {
                console.log("Warning! All fields must be filled")
                return
            }
            
            /* genero el id */
            let id 
            if(!products.length){
                id = 1
            } else {
                id = products[products.length-1].id + 1
            }                        
            
            const isCodeAlreadyAdded = products.some((prod)=> prod.code === code)
            if (isCodeAlreadyAdded) {
                console.log("Warning! The product code already exists")
                return
            }

            /* creo un nuevo producto con el id mas el producto que pasé por parametro al metodo
            mas el status por defecto */
            const newProduct = {id, ...product, status: true}

            /* pusheo el nuevo producto al array */
            products.push(newProduct)

            /* hago un segundo await para sobreescribir el archivo */
            await promises.writeFile(this.path, JSON.stringify(products))
            return newProduct            
        }
        catch (error) {
            console.log(error)
            return error
        }
    }



    async getProductById(id) {
        try {
            /* hago un await para esperar la respuesta del getProducts con el que traigo la info del archivo */
            const products = await this.getProducts()

            /* hago un find para encontrar el producto que coincida con el id y lo guardo en una variable */
            const productSearched = products.find(p=> p.id == id)            
            if (productSearched) {                
                return productSearched            
            }
        }
        catch (error) {
            return error
        }
    }



    async deleteProductById(id) {
        try {
            /* hago un await para esperar la respuesta del getProducts con el que traigo la info del archivo */
            const products = await this.getProducts()

            /* con un some verifico si el id del producto existe o no */
            const idExists = products.find(p=> p.id === id)  

            
            /* si el id existe, hago un filter para guardar en un array todos los demas productos
            y uso ese array para sobreescribir el archivo, usando await */
            if (idExists){
                const newArrayProducts = products.filter(p=> p.id !== id)
                await promises.writeFile(this.path, JSON.stringify(newArrayProducts))
                return idExists            
            }             
            }
        catch (error) {
            return error
        }
    }



    async updateProduct(id, obj) {
        try {            
            /* hago un await para esperar la respuesta del getProducts con el que traigo la info del archivo */
            const products = await this.getProducts()            

            /* hago un findIndex para encontrar el índice del producto correspondiente al id */
            const prodIndex = products.findIndex(p=> p.id == id)
            
            /* si ese indice es encontrado, aplico el metodo splice al array de productos, 
            para que reemplace el producto de prodIndex por el objeto que paso por parámetro */
            if (prodIndex !== -1) {
                const updatedProduct = {...products[prodIndex], ...obj}
                products.splice(prodIndex, 1, updatedProduct) 
                   
                /* hago un segundo await para sobreescribir el archivo */        
                await promises.writeFile(this.path, JSON.stringify(products))
                return updatedProduct
            }            
            }
        catch (error) {
            return error
        }
    }
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//TESTING

const prod1 = {    
    title: "producto1",
    description: "este es el producto 1",
    price: 200,
    thumbnail: ["imagen", "otra imagen"],
    code: "abc121",
    /* status: true,    */ 
    stock: 25,
    category: "categoria A"
}

const prod2 = {    
    title: "producto2",
    description: "este es el producto 2",
    price: 200,
    thumbnail: ["imagen", "otra imagen"],
    code: "abc122",
    /* status: true, */    
    stock: 25,
    category: "categoria B"
}

const prod3 = {    
    title: "producto3",
    description: "este es el producto 3",
    price: 200,
    thumbnail: ["imagen", "otra imagen"],
    code: "abc123",
    /* status: true, */    
    stock: 25,
    category: "categoria A"
}

const prod4 = {    
    title: "producto4",
    description: "este es el producto producto4",
    price: 200,
    thumbnail: ["imagen", "otra imagen"],
    code: "abc124",
    /* status: true, */    
    stock: 25,
    category: "categoria A"
}

const prod5 = {    
    title: "producto5",
    description: "este es el producto 5",
    price: 200,
    thumbnail: ["imagen", "otra imagen"],
    code: "abc125",
    /* status: true, */    
    stock: 25,
    category: "categoria C"
}

const prod6 = {    
    title: "producto6",
    description: "este es el producto 6",
    price: 200,
    thumbnail: ["imagen", "otra imagen"],
    code: "abc126",
    /* status: true, */    
    stock: 25,
    category: "categoria B"
}

const prod7 = {    
    title: "producto7",
    description: "este es el producto 7",
    price: 200,
    thumbnail: ["imagen", "otra imagen"],
    code: "abc127",
    /* status: true, */    
    stock: 25,
    category: "categoria B"
}

const prod8 = {    
    title: "producto8",
    description: "este es el producto 8",
    price: 200,
    thumbnail: ["imagen", "otra imagen"],
    code: "abc128",
    /* status: true, */    
    stock: 25,
    category: "categoria C"
}

const prod9 = {    
    title: "producto9",
    description: "este es el producto 9",
    price: 200,
    thumbnail: ["imagen", "otra imagen"],
    code: "abc129",
    /* status: true, */    
    stock: 25,
    category: "categoria A"
}

const prod10 = {    
    title: "producto10",
    description: "este es el producto 10",
    price: 200,
    thumbnail: ["imagen", "otra imagen"],
    code: "abc1210",
    /* status: true, */    
    stock: 25,
    category: "categoria B"
}





async function test() {
    const manager = new ProductManager("./data/myprods.json")
    
    /* este primer LLAMADO A GETPRODUCTS devuelve un array vacío */
    //console.log( await manager.getProducts())

    
    /* AGREGAR PRODUCTO */
    /* await manager.addProduct({
        title: "producto prueba1",
        description: "esto es un producto prueba",
        price: 200,
        thumbnail: "sin imagen",
        code: "abc122",    
        stock: 25
    })
    console.log( await manager.getProducts()) */
    

    /* GET PRODUCT BY ID */
    //console.log(await manager.getProductById(2))


    /* DELETE PRODUCT BY ID */
    /* await manager.deleteProductById(2)
    console.log( await manager.getProducts()) */


    /* UPDATE PRODUCT */
    /* await manager.updateProduct(1,{        
        title: "Producto Lindo",
        description: "Mi producto favorito",        
        code: "abc122"              
    })
    console.log( await manager.getProducts()) */


    /* AGREGO 10 PRODUCTOS */
    await manager.addProduct(prod1)
    await manager.addProduct(prod2)
    await manager.addProduct(prod3)
    await manager.addProduct(prod4)
    await manager.addProduct(prod5)
    await manager.addProduct(prod6)
    await manager.addProduct(prod7)
    await manager.addProduct(prod8)
    await manager.addProduct(prod9)
    await manager.addProduct(prod10)

}
   


//test()

export const manager = new ProductManager("./data/myprods.json");