//server/routes/common/feature-routes.js 

import express from 'express';

import { 
    addFeatureImage,
    getFeatureImages,
    deleteFeatureImage  // Add this line to delete a feature image
    } from '../../controllers/common/feature-controller.js';

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);
router.delete("/delete/:id", deleteFeatureImage);


export default router;
