import { Router } from "express";
import { cManager } from "../cartManager.js";


const router = Router();

/* CREATE CART */
router.post('/', async (req, res)=>{
    try {        
        const response = await cManager.createCart()
        res.status(200).json({message: 'Cart created', cart: response })
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
})



/* ADD PRODUCT TO CART */
router.post('/:cid/product/:pid', async (req, res) =>{    
    try{
        const {cid, pid} = req.params        
        if (+pid < 0){
            return res
            .status(401) 
            .json({message: "This is not a valid product id"})
        }
        const response = await cManager.addProductToCart(+cid, +pid)
        if (!response){
            return res
            .status(404) 
            .json({message: "This cart id doesnt exist"})
        }
        res.status(200).json({message: "Product added to cart", productAdded: response})        
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
})



/* GET CART */
router.get('/:cid', async (req, res)=>{
    try {
        const {cid} = req.params
        const response = await cManager.getCartProducts(+cid)
        if (!response){
            return res
            .status(404) 
            .json({message: "This cart id doesnt exist"})
        }
        res.status(200).json({message: 'Cart founded', cartProducts: response.products })
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
})


export default router