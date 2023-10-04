import { Router } from "express";
import { manager } from "../prodManager.js";

const router = Router();


/* este se visualiza en localhost:8080/ 
llamo al metodo getProducts, que me trae los productos del json y renderiza
el handlebars index*/
router.get("/", async (req, res) => {  
    try {
        const response = await manager.getProducts(req.query);
        res.render("index", {response, style: "style"});
        console.log(response)
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
});



/* este se visualiza en /realtimeproducts y renderiza ese handlebars */
router.get("/realtimeproducts",  (req,res)=>{    
    res.render("realTimeProducts", {style: "styleRealTime"})    
});


export default router;