//server/routes/common/feature-routes.js 

import express from 'express';

import { 
    addFeatureImage,
    getFeatureImages,
    deleteFeatureImage,  // Add this line to delete a feature image
    getFeatureSignature
    } from '../../controllers/common/feature-controller.js';

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/signature", getFeatureSignature);
router.get("/get", getFeatureImages);
router.delete("/delete/:id", deleteFeatureImage);


export default router;
