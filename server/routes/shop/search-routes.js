// server/routes/shop/search-routes.js

import express from 'express';
import { 
    searchProducts
    } from '../../controllers/shop/search-controller.js';

const router = express.Router();

// pass the keyword receiver from our params in our controller then import this in our server.js
router.get("/:keyword", searchProducts);

export default router;