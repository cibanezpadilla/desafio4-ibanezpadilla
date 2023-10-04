import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import { manager } from "./prodManager.js";

import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";



//creo una instancia de una aplicación express
const app = express();


/* Configuro el middleware express.json() en mi aplicación Express, para analizar y procesar 
las solicitudes entrantes que tienen datos en formato JSON en su cuerpo */
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


// handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");


/* -----------------------------------------------------------------*/
/* ROUTES */

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
/* le saco lo de api/views porque fue un ejemplo de clase */
app.use("/", viewsRouter);



/* -----------------------------------------------------------------*/
/*ESCUCHANDO */

const httpServer = app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

const socketServer = new Server(httpServer);




/* mi socketServer */

const allProducts= await manager.getProducts();

  socketServer.on(`connection`, (socket) => {
    
  console.log(`cliente conectado: ${socket.id}`);
  
  socket.emit(`productosInicial`,allProducts)



  socket.on('addProduct', async(product)=>{

    const producto= await manager.addProduct(product);
    const productosActualizados = await manager.getProducts();
    socket.emit('productUpdate', productosActualizados)   

  })

  socket.on('deleteProduct', async(id)=> {
    const producto= await manager.deleteProductById(id);
    const productosActualizados = await manager.getProducts();
    socket.emit('productUpdate', productosActualizados)   
  })
});