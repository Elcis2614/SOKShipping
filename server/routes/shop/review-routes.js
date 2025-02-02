// server/routes/shop/review-routes.js
import express from 'express';

import { 
    addProductReview,
    getProductReviews
    } from '../../controllers/shop/product-review-controller.js';

const router = express.Router();

// pass the keyword receiver from our params in our controller then import this in our server.js
router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);

export default router;