const socketClient = io();

/* la comento porque no me funcionó :(  */
/* import { toCapital } from '../../utils.js' */

/* capturo elementos del Form-add del handlebars */
const form = document.getElementById("form-add");
const inputTitle = document.getElementById("title");
const inputDescription= document.getElementById("description");
const inputStatus= document.getElementById("status");    
const inputPrice= document.getElementById("price");
const inputCode= document.getElementById("code");
const inputStock= document.getElementById("stock");
const inputCategory= document.getElementById("category");


/* capturo elementos del form-delete del handlebars */
const formDelete = document.getElementById("form-delete");
const inputId = document.getElementById("idToDelete");

socketClient.on("productosInicial", (allProducts)=>{
    renderProductos(allProducts);
})



function renderProductos(products) {
    divRealTimeProduct.innerHTML = "";
    products.forEach((product) => {
      const pDiv = document.createElement("div");      
  
      pDiv.innerHTML = `                      
                            <h3>Title: ${product.title}</h3>
                            <p>ID: ${product.id}</p>
                            <p>Description: ${product.description}</p>
                            <p>Status: ${product.status}</p>
                            <p>Price: ${product.price}</p>
                            <p>Code: ${product.code}</p>
                            <p>Stock: ${product.stock}</p>
                            <p>Category: ${product.category}</p>`;
  
    divRealTimeProduct.append(pDiv);
    });
}




form.onsubmit=(e) =>{
    e.preventDefault();

    const title = inputTitle.value
    const description=inputDescription.value;
    const status=inputStatus.value;
    const price=inputPrice.value;
    const code=inputCode.value;
    const stock=inputStock.value;
    const category=inputCategory.value;

    socketClient.emit("addProduct", {title,description,status,price,code,stock,category})

    form.reset()
}



socketClient.on("productUpdate", (products)=>{
    renderProductos(products);
})


formDelete.onsubmit=(e)=>{
    e.preventDefault()
    const id = Number(inputId.value)
    socketClient.emit('deleteProduct', id)
    formDelete.reset()
}

/* socketClient.on("productDeleted", (products)=>{
    renderProductos(products);
}) */