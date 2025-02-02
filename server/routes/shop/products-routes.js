// server/routes/shop/products-routes.js 

import express from 'express';
import { 
    getFilteredProducts,
    getProductDetails 
    } from '../../controllers/shop/products-controller.js';

const router = express.Router();


router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);

export default router;